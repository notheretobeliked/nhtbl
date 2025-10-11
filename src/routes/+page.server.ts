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
  const uri = '/'
  
  
  try {
    const data = await urqlQuery(PageContent, { uri: uri })

    if (data.nodeByUri === null) {
      error(404, {
        message: 'Not found',
      })
    }

    let editorBlocks: (EditorBlock & { attributes?: any; children?: any[] })[] = data.nodeByUri.editorBlocks ? flatListToHierarchical(data.nodeByUri.editorBlocks) : []

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

    // Check if any blocks need external project data
    const needsAllProjects = allPortfolioBlocks.some(block => {
      if ((block as any).portfolioBlock) {
        const config = (block as any).portfolioBlock
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
      backgroundColour: backgroundColour,
      editorBlocks: editorBlocks,
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
