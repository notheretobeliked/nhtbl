export const prerender = true
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { urqlQuery } from '$lib/graphql/client'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { ExtendedEditorBlock } from '$lib/types/wp-types'
import { getAllProjects } from '$lib/utilities/projectsCache'
import { resolvePortfolioProjects } from '$lib/utilities/portfolioResolver'
import { cleanNavigationUrls } from '$lib/utilities/utilities'
import { normalizeEditorBlock, flatListToHierarchical, processBreadcrumbs } from '$lib/utilities/wordpress-content'
import { GRAPHQL_ENDPOINT } from '$env/static/private'




export const load: PageServerLoad = async function load({ params, url }) {
  const uri = `/${params.all || ''}`
  console.log('🔍 Loading page:', uri)
  	// Handle authentication for previews
	let authResult: { authenticated: boolean; token?: string } = { authenticated: false }

  
  try {
    console.log('📡 Querying GraphQL for:', uri)
    const data = await urqlQuery(PageContent, { uri: uri })
    console.log('✅ GraphQL response received, nodeByUri exists:', !!data.nodeByUri)

    if (data.nodeByUri === null) {
      error(404, {
        message: 'Not found',
      })
    }

    let editorBlocks: ExtendedEditorBlock[] = data.nodeByUri.editorBlocks ? flatListToHierarchical(data.nodeByUri.editorBlocks as ExtendedEditorBlock[]) : []

    // Recursively find portfolio blocks
    const findPortfolioBlocks = (blocks: any[]): any[] => {
      const portfolioBlocks: any[] = []
      
      const searchBlocks = (blockList: any[]) => {
        blockList.forEach(block => {
          if (block.name === 'acf/portfolio-block') {
            portfolioBlocks.push(block)
          }
          if (block.children && Array.isArray(block.children)) {
            searchBlocks(block.children)
          }
          if (block.innerBlocks && Array.isArray(block.innerBlocks)) {
            searchBlocks(block.innerBlocks)
          }
        })
      }
      
      searchBlocks(blocks)
      return portfolioBlocks
    }

    const allPortfolioBlocks = findPortfolioBlocks(editorBlocks)
    
    // Check if page contains any survey blocks
    const hasSurvey = ((blocks: any[]): boolean => {
      const searchForSurveys = (blockList: any[]): boolean => {
        for (const block of blockList) {
          if (block.name === 'acf/survey-block') {
            return true
          }
          if (block.children && Array.isArray(block.children)) {
            if (searchForSurveys(block.children)) return true
          }
          if (block.innerBlocks && Array.isArray(block.innerBlocks)) {
            if (searchForSurveys(block.innerBlocks)) return true
          }
        }
        return false
      }
      return searchForSurveys(blocks)
    })(editorBlocks)
    

    // Check if any blocks need external project data (not specific projects with full data)
    const needsAllProjects = allPortfolioBlocks.some(block => {
      if ((block as any).portfolioBlock) {
        const config = (block as any).portfolioBlock
        // Only fetch allProjects for 'all' and 'by_service' modes, or 'specific' without full data
        return config.projectSource === 'all' || 
               config.projectSource === 'by_service' ||
               (config.projectSource === 'specific' && 
                (!config.specificProjects?.nodes?.[0]?.title || 
                 !config.specificProjects?.nodes?.[0]?.featuredImage))
      }
      return false
    })

    let allProjects: any[] = []
    if (needsAllProjects) {
      allProjects = await getAllProjects()
    } 

    // Recursively process portfolio blocks to resolve their projects
    const processBlocksRecursively = (blocks: any[]): any[] => {
      return blocks.map(block => {
        if (block.name === 'acf/portfolio-block') {
          
          if ((block as any).portfolioBlock) {
            const portfolioBlock = (block as any).portfolioBlock
            
            const resolvedProjects = resolvePortfolioProjects(portfolioBlock, allProjects)
                        
            return {
              ...block,
              resolvedProjects
            }
          }
        }
        
        // Process children recursively
        const processedBlock = { ...block }
        if (block.children && Array.isArray(block.children)) {
          processedBlock.children = processBlocksRecursively(block.children)
        }
        if (block.innerBlocks && Array.isArray(block.innerBlocks)) {
          processedBlock.innerBlocks = processBlocksRecursively(block.innerBlocks)
        }
        
        return processedBlock
      })
    }

    editorBlocks = processBlocksRecursively(editorBlocks)

    const backgroundColour = data.nodeByUri.backgroundColour?.backgroundColour ?? 'white'

    const returnData = {
      uri: uri,
      id: data.nodeByUri.databaseId,
      backgroundColour: backgroundColour,
      editorBlocks: editorBlocks,
      hasSurvey: hasSurvey,
      breadcrumbs: processBreadcrumbs(data.nodeByUri?.seo?.breadcrumbs, new URL(GRAPHQL_ENDPOINT).origin),
    }
    
    // Clean navigation URLs in the response data (preserving media URLs)
    const backendUrl = new URL(GRAPHQL_ENDPOINT)
    const cleanedData = cleanNavigationUrls(returnData, backendUrl.origin)
    
    return JSON.parse(JSON.stringify(cleanedData))
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      throw error(httpError.status ?? 500, httpError.message)
    }
    throw error(500, err as string)
  }
}
