// @ts-nocheck
export const prerender = true
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { urqlQuery } from '$lib/graphql/client'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/graphql/generated'
import { getAllProjects } from '$lib/utilities/projectsCache'
import { resolvePortfolioProjects } from '$lib/utilities/portfolioResolver'
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

function normalizeEditorBlock(block: EditorBlock) {
  // Ensure attributes exists before attempting to access it
  if (!block.attributes) {
    block.attributes = {} // Initialize with an empty object if it doesn't exist
  }

  if (block.name.startsWith('acf/')) {
    if (block.name === 'acf/portfolio-block') {
      console.log(`🔧 [ALL] Normalizing portfolio block - BEFORE:`, {
        align: block.attributes.align,
        alignment: block.attributes.alignment,
        hasAlignment: 'alignment' in block.attributes
      })
    }
    
    if ('alignment' in block.attributes) {
      // Prefer 'alignment' over 'align', but don't overwrite if 'align' already exists
      block.attributes.align = block.attributes.align || block.attributes.alignment
      // Remove the 'alignment' attribute to avoid confusion
      delete block.attributes.alignment
    }
    
    if (block.name === 'acf/portfolio-block') {
      console.log(`🔧 [ALL] Normalizing portfolio block - AFTER:`, {
        align: block.attributes.align
      })
    }
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

function flatListToHierarchical(data: EditorBlock[] = [], { idKey = 'clientId', parentKey = 'parentClientId', childrenKey = 'children' }: HierarchicalOptions = {}): EditorBlock[] {
  const tree: EditorBlock[] = []
  const childrenOf: Record<string, EditorBlock[]> = {}

  data.forEach(item => {
    const newItem: EditorBlock = { ...item }
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

export const load = async function load({ params, url }: Parameters<PageServerLoad>[0]) {
  const uri = `/${params.all || ''}`
  
  console.log('🚀 [ALL] Server load called for URI:', uri)
  console.log('🚀 [ALL] Params:', params)
  
  try {
    const data = await urqlQuery(PageContent, { uri: uri })

    if (data.nodeByUri === null) {
      error(404, {
        message: 'Not found',
      })
    }

    let editorBlocks: EditorBlock[] = data.nodeByUri.editorBlocks ? flatListToHierarchical(data.nodeByUri.editorBlocks) : []

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
    console.log(`🔍 [ALL] Found ${allPortfolioBlocks.length} portfolio blocks (including nested)`)

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
      console.log('📊 Page needs external projects data, fetching...')
      allProjects = await getAllProjects()
    } else {
      console.log('📊 Page uses embedded project data, skipping external fetch')
    }

    // Recursively process portfolio blocks to resolve their projects
    const processBlocksRecursively = (blocks: any[]): any[] => {
      return blocks.map(block => {
        if (block.name === 'acf/portfolio-block') {
          console.log(`📊 [ALL] Found portfolio block!`, (block as any).portfolioBlock ? 'Has portfolioBlock data' : 'Missing portfolioBlock data')
          console.log(`📊 [ALL] Block attributes:`, block.attributes)
          
          if ((block as any).portfolioBlock) {
            const portfolioBlock = (block as any).portfolioBlock
            console.log(`📊 [ALL] Portfolio config:`, {
              projectSource: portfolioBlock.projectSource,
              specificProjectsCount: portfolioBlock.specificProjects?.nodes?.length || 0,
              displayMode: portfolioBlock.displayMode,
              blockAlign: block.attributes?.align
            })
            
            const resolvedProjects = resolvePortfolioProjects(portfolioBlock, allProjects)
            
            console.log(`🎯 [ALL] Portfolio block resolved ${resolvedProjects.length} projects (source: ${portfolioBlock.projectSource})`)
            
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

    console.log(`🔍 [ALL] Processing ${editorBlocks.length} editor blocks recursively...`)
    editorBlocks = processBlocksRecursively(editorBlocks)

    const backgroundColour = data.nodeByUri.backgroundColour?.backgroundColour ?? 'white'

    const returnData = {
      uri: uri,
      backgroundColour: backgroundColour,
      editorBlocks: editorBlocks,
      breadcrumbs: processBreadcrumbs(data.nodeByUri?.seo?.breadcrumbs),
    }
    
    return JSON.parse(JSON.stringify(returnData))
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      throw error(httpError.status ?? 500, httpError.message)
    }
    throw error(500, err as string)
  }
}
