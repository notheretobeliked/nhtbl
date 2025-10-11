import { WORDPRESS_URL } from '$env/static/private'
export const prerender = false // Disable prerendering for preview functionality

import PreviewContent from '$lib/graphql/query/preview.graphql?raw'
import { urqlQuery } from '$lib/graphql/client'
import { canUserPreview } from '$lib/utilities/wordpress-auth'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { ExtendedEditorBlock } from '$lib/types/wp-types'
import { cleanNavigationUrls } from '$lib/utilities/utilities'
import { normalizeEditorBlock, flatListToHierarchical, processBreadcrumbs, createCategoryHierarchy } from '$lib/utilities/wordpress-content'
import { GRAPHQL_ENDPOINT } from '$env/static/private'

// Portfolio-specific helper functions
const formatYearRange = (startDate: string | null | undefined, endDate: string | null | undefined): string => {
  // If both dates are empty, return empty string
  if (!startDate && !endDate) {
    return ''
  }

  // If start date is empty but end date exists, return just end year
  if (!startDate && endDate) {
    const endYear = new Date(endDate).getFullYear()
    return endYear.toString()
  }

  // If end date is empty but start date exists, return just start year
  if (startDate && !endDate) {
    const startYear = new Date(startDate).getFullYear()
    return startYear.toString()
  }

  // Both dates exist
  if (startDate && endDate) {
    const startYear = new Date(startDate).getFullYear()
    const endYear = new Date(endDate).getFullYear()

    // If same year, return just that year
    if (startYear === endYear) {
      return startYear.toString()
    } else {
      return `${startYear}–${endYear}`
    }
  }

  return ''
}


export const load: PageServerLoad = async function load({ url }) {
  
  // Extract preview parameters
  const previewId = url.searchParams.get('p') || url.searchParams.get('page_id') || url.searchParams.get('preview_id')
  const previewToken = url.searchParams.get('token')
  const postType = url.searchParams.get('post_type')
  const isPreview = !!(previewId || url.searchParams.has('preview'))
  const isProjectPreview = postType === 'project'
  

  // Handle missing token for preview
  if (isPreview && !previewToken) {
    const returnUrl = encodeURIComponent(url.href)
    const loginUrl = `${WORDPRESS_URL}/wp/wp-login.php?redirect_to=${returnUrl}`
    throw redirect(302, loginUrl)
  }

  // Validate token first if provided
  if (isPreview && previewToken) {
    try {
      const tokenValidation = await fetch(`${WORDPRESS_URL}wp-json/sveltekit/v1/validate-token`, {
        method: 'POST',
        headers: {
          'X-Preview-Token': previewToken,
          'Content-Type': 'application/json'
        }
      })

      if (!tokenValidation.ok) {
        const errorData = await tokenValidation.json()
        
        if (errorData.code === 'invalid_token') {
          throw error(401, 'Preview token has expired or is invalid. Please log into WordPress and generate a new preview link.')
        } else if (errorData.code === 'no_token') {
          throw error(401, 'No preview token provided. Please use a valid preview link from WordPress.')
        } else if (errorData.code === 'invalid_user') {
          throw error(401, 'Preview token user no longer exists. Please log into WordPress and generate a new preview link.')
        } else {
          throw error(401, 'Authentication failed. Please log into WordPress and generate a new preview link.')
        }
      }

      const validationResult = await tokenValidation.json()
    } catch (err: any) {
      // If it's already an error we threw, re-throw it
      if (err.status) {
        throw err
      }
      
      // Handle network errors
      throw error(500, 'Unable to validate preview token. Please check your connection and try again.')
    }
  }

  try {
    let variables: any
    let queryOptions: any = {}

    if (isPreview && previewId) {
      // Preview mode: query by ID with preview enabled
      variables = {
        id: previewId
      }
      
      // Add auth token if available
      if (previewToken) {
        queryOptions.token = previewToken
      }
      
    } else {
      // Regular mode: should not happen in preview route, but fallback
      error(400, 'Preview route requires preview parameters')
    }

    // Use the dedicated preview query
    const data = await urqlQuery(PreviewContent, variables, queryOptions)
    

    // Extract the node from preview queries
    // For projects, prioritize nhtblProject which has the full project data
    const node = isProjectPreview && data.nhtblProject 
      ? data.nhtblProject 
      : (data.page || data.nhtblProject || data.post)
    
    
    if (!node) {
      throw error(404, `Content not found for preview ID: ${previewId}. The content may have been deleted or you may not have permission to view it.`)
    }

    // Validate preview status
    if (node.status && !['publish', 'draft', 'private', 'pending', 'inherit'].includes(node.status)) {
      throw error(403, `Preview not available for content with status "${node.status}". Only draft, private, pending, and published content can be previewed.`)
    }

    // Process editor blocks
    let editorBlocks: ExtendedEditorBlock[] = node.editorBlocks 
      ? flatListToHierarchical(node.editorBlocks as ExtendedEditorBlock[])
      : []
    
    // Apply portfolio-specific block modifications if this is a project
    const isPortfolioProject = isProjectPreview
    if (isPortfolioProject) {
      editorBlocks = editorBlocks.map(block => {
        const updatedBlock = {
          ...block,
          attributes: {
            ...block.attributes,
            align: 'full'
          }
        }
        
        // If this is a core/columns block, set background color to black
        if (block.name === 'core/columns') {
          updatedBlock.attributes = {
            ...updatedBlock.attributes,
            backgroundColor: 'black'
          }
        }
        
        return updatedBlock
      })
    }
    

    // Prepare base return data
    let returnData: any = {
      uri: `preview-${previewId}`,
      backgroundColour: node.backgroundColour?.backgroundColour ?? (isPortfolioProject ? 'black' : 'white'),
      editorBlocks,
      breadcrumbs: [], // No SEO data in preview mode
      isPreview: true,
      authenticated: !!previewToken,
      title: node.title || 'Preview',
      previewData: {
        status: node.status || 'unknown',
        lastModified: node.modified,
        canEdit: canUserPreview({ authenticated: !!previewToken, token: previewToken })
      }
    }

    // Add portfolio-specific data if this is a project
    if (isPortfolioProject) {
      
      // Extract services (only child services, not parents)
      const services = (node as any).nhtblServices?.nodes
        ?.filter((service: any) => service?.parentId !== null && service?.parentId !== undefined)
        ?.map((service: any) => service?.name)
        ?.filter(Boolean) ?? []
      
      // Extract clients
      const clients = (node as any).nhtblClients?.nodes
        ?.map((client: any) => client?.name)
        ?.filter(Boolean) ?? []
      
      // Format year display
      const yearDisplay = formatYearRange(
        (node as any).projectData?.startDate, 
        (node as any).projectData?.endDate
      )
      

      // Add portfolio-specific fields
      returnData = {
        ...returnData,
        pageType: 'portfolio-item',
        yearDisplay,
        excerpt: (node as any).excerpt ?? '',
        services,
        clients,
        portfolioData: {
          // Add any additional portfolio-specific data here
          isPreview: true
        }
      }
    } else {
      // Ensure non-portfolio projects have the correct pageType
      returnData.pageType = 'page'
    }
    
    // Clean navigation URLs
    const backendUrl = new URL(GRAPHQL_ENDPOINT)
    const cleanedData = cleanNavigationUrls(returnData, backendUrl.origin)
    
    return JSON.parse(JSON.stringify(cleanedData))
  } catch (err: unknown) {
    
    // Handle SvelteKit errors (already have proper status and message)
    const httpError = err as { status?: number; message?: string }
    if (httpError.status && httpError.message) {
      throw err
    }
    
    // Handle GraphQL errors
    if (err instanceof Error && err.message.includes('GraphQL Error')) {
      throw error(500, 'Failed to load preview content from WordPress. Please check if the content exists and try again.')
    }
    
    // Handle network errors
    if (err instanceof Error && (err.message.includes('fetch') || err.message.includes('network'))) {
      throw error(503, 'Unable to connect to WordPress. Please check your connection and try again.')
    }
    
    // Generic fallback
    throw error(500, 'An unexpected error occurred while loading the preview. Please try again or contact support.')
  }
}