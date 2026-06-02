import { WORDPRESS_URL } from '$env/static/private'
export const prerender = false // Disable prerendering for preview functionality

import PreviewContent from '$lib/graphql/query/preview.graphql?raw'
import { urqlQuery } from '$lib/graphql/client'
import { canUserPreview } from '$lib/utilities/wordpress-auth'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { ExtendedEditorBlock } from '$lib/types/wp-types'
import { cleanNavigationUrls, markStretchFill } from '$lib/utilities/utilities'
import { flatListToHierarchical } from '$lib/utilities/wordpress-content'
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

  // No separate REST validate-token round-trip (the previous source of preview
  // breakage). The GraphQL query below authenticates via the X-Preview-Token
  // header that urqlQuery sends when a token is passed — same as the template.
  // An invalid token simply returns no draft content, handled as a 404 below.

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

    // Process editor blocks — match the portfolio page exactly: build the
    // hierarchy, mark stretch-section images to fill, and drop the editor-only
    // excerpt block. No forced alignment or column background.
    const editorBlocks: ExtendedEditorBlock[] = (node.editorBlocks
      ? markStretchFill(flatListToHierarchical(node.editorBlocks as ExtendedEditorBlock[]))
      : []
    ).filter((b: any) => b.name !== 'core/post-excerpt')

    const isPortfolioProject = isProjectPreview
    

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
        canEdit: canUserPreview({ authenticated: !!previewToken, token: previewToken ?? undefined })
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
    // Log the real error server-side so preview failures are diagnosable.
    console.error('[preview] load failed:', err)

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