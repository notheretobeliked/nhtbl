export const prerender = true
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { urqlQuery } from '$lib/graphql/client'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { ExtendedEditorBlock } from '$lib/types/wp-types'
import { getAllProjects } from '$lib/utilities/projectsCache'
import { resolvePortfolioProjects } from '$lib/utilities/portfolioResolver'
import { cleanNavigationUrls } from '$lib/utilities/utilities'
import { GRAPHQL_ENDPOINT } from '$env/static/private'

interface HierarchicalOptions {
  idKey?: string
  parentKey?: string
  childrenKey?: string
}

// Function to process breadcrumbs and make URLs relative
function processBreadcrumbs(breadcrumbs: any[] = []) {
  if (!breadcrumbs || !Array.isArray(breadcrumbs)) {
    return []
  }
  
  // Extract the backend domain from GRAPHQL_ENDPOINT
  // GRAPHQL_ENDPOINT is something like "http://nhtbl-backend.test/wp/graphql"
  const backendUrl = new URL(GRAPHQL_ENDPOINT)
  const backendOrigin = backendUrl.origin // "http://nhtbl-backend.test"
  
  return breadcrumbs.map(crumb => ({
    ...crumb,
    url: crumb.url ? crumb.url.replace(backendOrigin, '') || '/' : undefined
  }))
}

function normalizeEditorBlock(block: ExtendedEditorBlock): ExtendedEditorBlock {
  // Ensure attributes exists before attempting to access it
  if (!block.attributes) {
    block.attributes = {} // Initialize with an empty object if it doesn't exist
  }

  // Check if 'style' attribute exists and is a string
  // Check if 'style' attribute exists and is a string
  if (typeof block.attributes.style === 'string') {
    try {
      // Parse the 'style' string as JSON
      block.attributes.style = JSON.parse(block.attributes.style.replace(/var:preset\|/g, ''))

      // Check and transform the color within 'elements.link' after parsing
      if (
        block.attributes.style.elements &&
        block.attributes.style.elements.link &&
        block.attributes.style.elements.link.color &&
        block.attributes.style.elements.link.color.text
      ) {
        // Extracting color value after '|'
        const colorValue = block.attributes.style.elements.link.color.text.split('|')[1]
        // Assigning the extracted color value to a new property
        block.attributes.style.textColor = colorValue
      }
    } catch (error) {
      console.error('Error parsing style attribute:', error)
      block.attributes.style = null // Example error handling
    }
  }

  if (typeof block.attributes.layout === 'string') {
    try {
      block.attributes.layout = JSON.parse(block.attributes.layout)
    } catch (error) {
      console.error('Error parsing layout attribute:', error)
      block.attributes.layout = null // Or handle the error as needed
    }
  }

  // Normalize child blocks recursively
  if (block.children) {
    block.children = block.children.map(normalizeEditorBlock)
  }

  return block
}

function flatListToHierarchical(data: ExtendedEditorBlock[] = [], { idKey = 'clientId', parentKey = 'parentClientId', childrenKey = 'children' }: HierarchicalOptions = {}): ExtendedEditorBlock[] {
  const tree: ExtendedEditorBlock[] = []
  const childrenOf: Record<string, ExtendedEditorBlock[]> = {}

  data.forEach(item => {
    const newItem: ExtendedEditorBlock = { ...item }
    const parentId: string = newItem[parentKey] == null ? '0' : newItem[parentKey]

    childrenOf[newItem[idKey]] = childrenOf[newItem[idKey]] || []
    newItem[childrenKey] = childrenOf[newItem[idKey]]

    if (parentId !== '0') {
      childrenOf[parentId] = childrenOf[parentId] || []
      childrenOf[parentId].push(newItem)
    } else {
      tree.push(newItem)
    }
  })

  return tree.map(normalizeEditorBlock) // Normalize each root level block
}

export const load: PageServerLoad = async function load({ params, url }) {
  const uri = `/${params.all || ''}`
  
  
  try {
    const data = await urqlQuery(PageContent, { uri: uri })

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
      backgroundColour: backgroundColour,
      editorBlocks: editorBlocks,
      breadcrumbs: processBreadcrumbs(data.nodeByUri?.seo?.breadcrumbs),
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
