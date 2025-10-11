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
  console.log('🔍 PREVIEW ROUTE DEBUG:')
  console.log('Full URL:', url.href)
  console.log('Search params:', Object.fromEntries(url.searchParams.entries()))
  
  // Extract preview parameters
  const previewId = url.searchParams.get('p') || url.searchParams.get('page_id') || url.searchParams.get('preview_id')
  const previewToken = url.searchParams.get('token')
  const postType = url.searchParams.get('post_type')
  const isPreview = !!(previewId || url.searchParams.has('preview'))
  const isProjectPreview = postType === 'project'
  
  console.log('Extracted params:', { previewId, previewToken, postType, isPreview, isProjectPreview })

  // Handle missing token for preview
  if (isPreview && !previewToken) {
    console.log('❌ Missing token, redirecting to WordPress login')
    const returnUrl = encodeURIComponent(url.href)
    const loginUrl = `${WORDPRESS_URL}/wp/wp-login.php?redirect_to=${returnUrl}`
    throw redirect(302, loginUrl)
  }

  // Validate token first if provided
  if (isPreview && previewToken) {
    try {
      console.log('🔍 Validating preview token...')
      const tokenValidation = await fetch(`${WORDPRESS_URL}wp-json/sveltekit/v1/validate-token`, {
        method: 'POST',
        headers: {
          'X-Preview-Token': previewToken,
          'Content-Type': 'application/json'
        }
      })

      if (!tokenValidation.ok) {
        const errorData = await tokenValidation.json()
        console.log('❌ Token validation failed:', errorData)
        
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
      console.log('✅ Token validation successful:', validationResult)
    } catch (err: any) {
      // If it's already an error we threw, re-throw it
      if (err.status) {
        throw err
      }
      
      // Handle network errors
      console.error('❌ Token validation network error:', err)
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
      
      console.log('🔍 GraphQL Variables:', variables)
      console.log('🔍 Query Options:', queryOptions)
    } else {
      // Regular mode: should not happen in preview route, but fallback
      console.log('❌ Missing preview parameters')
      error(400, 'Preview route requires preview parameters')
    }

    console.log('📡 Making GraphQL query...')
    // Use the dedicated preview query
    const data = await urqlQuery(PreviewContent, variables, queryOptions)
    
    console.log('✅ GraphQL Response received:', {
      hasPage: !!data.page,
      hasNhtblProject: !!data.nhtblProject,
      hasPost: !!data.post,
      keys: Object.keys(data)
    })

    // Extract the node from preview queries
    // For projects, prioritize nhtblProject which has the full project data
    const node = isProjectPreview && data.nhtblProject 
      ? data.nhtblProject 
      : (data.page || data.nhtblProject || data.post)
    
    console.log('🎯 Selected node:', node ? { 
      type: node.__typename, 
      id: node.id, 
      title: node.title, 
      status: node.status 
    } : 'NO NODE FOUND')
    
    if (!node) {
      console.log('❌ No node found in GraphQL response')
      throw error(404, `Content not found for preview ID: ${previewId}. The content may have been deleted or you may not have permission to view it.`)
    }

    // Validate preview status
    console.log('🔍 Node status validation:', node.status)
    if (node.status && !['publish', 'draft', 'private', 'pending', 'inherit'].includes(node.status)) {
      console.log('❌ Invalid status for preview:', node.status)
      throw error(403, `Preview not available for content with status "${node.status}". Only draft, private, pending, and published content can be previewed.`)
    }

    console.log('🔄 Processing editor blocks...')
    // Process editor blocks
    let editorBlocks: ExtendedEditorBlock[] = node.editorBlocks 
      ? flatListToHierarchical(node.editorBlocks as ExtendedEditorBlock[])
      : []
    
    // Apply portfolio-specific block modifications if this is a project
    const isPortfolioProject = isProjectPreview
    if (isPortfolioProject) {
      console.log('🎨 Applying portfolio project styling...')
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
    
    console.log('📊 Processed blocks count:', editorBlocks.length)

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
      console.log('📁 Adding portfolio project data...')
      console.log('🔍 Node data:', {
        excerpt: (node as any).excerpt,
        nhtblServices: (node as any).nhtblServices,
        nhtblClients: (node as any).nhtblClients,
        projectData: (node as any).projectData
      })
      
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
      
      console.log('📊 Extracted data:', { services, clients, yearDisplay, excerpt: (node as any).excerpt })

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
    
    console.log('🧹 Cleaning navigation URLs...')
    // Clean navigation URLs
    const backendUrl = new URL(GRAPHQL_ENDPOINT)
    const cleanedData = cleanNavigationUrls(returnData, backendUrl.origin)
    
    console.log('✅ Preview data prepared successfully')
    return JSON.parse(JSON.stringify(cleanedData))
  } catch (err: unknown) {
    console.error('❌ PREVIEW ERROR:', err)
    console.error('Error type:', typeof err)
    console.error('Error constructor:', err?.constructor?.name)
    
    if (err instanceof Error) {
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
    }
    
    // Handle SvelteKit errors (already have proper status and message)
    const httpError = err as { status?: number; message?: string }
    if (httpError.status && httpError.message) {
      console.error('🔥 Re-throwing HTTP error:', httpError.status, httpError.message)
      throw err
    }
    
    // Handle GraphQL errors
    if (err instanceof Error && err.message.includes('GraphQL Error')) {
      console.error('🔥 GraphQL error detected')
      throw error(500, 'Failed to load preview content from WordPress. Please check if the content exists and try again.')
    }
    
    // Handle network errors
    if (err instanceof Error && (err.message.includes('fetch') || err.message.includes('network'))) {
      console.error('🔥 Network error detected')
      throw error(503, 'Unable to connect to WordPress. Please check your connection and try again.')
    }
    
    // Generic fallback
    console.error('🔥 Throwing generic error:', err)
    throw error(500, 'An unexpected error occurred while loading the preview. Please try again or contact support.')
  }
}