import { WORDPRESS_URL } from '$env/static/private'
export const prerender = false // Disable prerendering for preview functionality

import PreviewContent from '$lib/graphql/query/preview.graphql?raw'
import { urqlQuery } from '$lib/graphql/client'
import { canUserPreview } from '$lib/utilities/wordpress-auth'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { ExtendedEditorBlock } from '$lib/types/wp-types'
import { cleanNavigationUrls } from '$lib/utilities/utilities'
import { normalizeEditorBlock, flatListToHierarchical, processBreadcrumbs } from '$lib/utilities/wordpress-content'
import { GRAPHQL_ENDPOINT } from '$env/static/private'


export const load: PageServerLoad = async function load({ url }) {
  console.log('🔍 PREVIEW ROUTE DEBUG:')
  console.log('Full URL:', url.href)
  console.log('Search params:', Object.fromEntries(url.searchParams.entries()))
  
  // Extract preview parameters
  const previewId = url.searchParams.get('p') || url.searchParams.get('page_id') || url.searchParams.get('preview_id')
  const previewToken = url.searchParams.get('token')
  const isPreview = !!(previewId || url.searchParams.has('preview'))
  
  console.log('Extracted params:', { previewId, previewToken, isPreview })

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

    // Extract the node from preview queries (page, nhtblProject, or post)
    const node = data.page || data.nhtblProject || data.post
    
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
    
    console.log('📊 Processed blocks count:', editorBlocks.length)

    // Prepare return data
    const returnData = {
      uri: `preview-${previewId}`,
      backgroundColour: node.backgroundColour?.backgroundColour ?? 'white',
      editorBlocks,
      breadcrumbs: [], // No SEO data in preview mode
      isPreview: true,
      authenticated: !!previewToken,
      previewData: {
        status: node.status || 'unknown',
        lastModified: node.modified,
        canEdit: canUserPreview({ authenticated: !!previewToken, token: previewToken })
      }
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