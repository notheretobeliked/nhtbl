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

function normalizeEditorBlock(block: EditorBlock & { attributes?: any; children?: any[] }): EditorBlock & { attributes?: any; children?: any[] } {
  if (!block.attributes) {
    block.attributes = {}
  }

  if (block.name && block.name.startsWith('acf/')) {
    if (block.name === 'acf/portfolio-block') {
      console.log(`🔧 [HOME] Normalizing portfolio block - BEFORE:`, {
        align: block.attributes.align,
        alignment: block.attributes.alignment,
        hasAlignment: 'alignment' in block.attributes
      })
    }
    
    if ('alignment' in block.attributes) {
      block.attributes.align = block.attributes.align || block.attributes.alignment
      delete block.attributes.alignment
    }
    
    if (block.name === 'acf/portfolio-block') {
      console.log(`🔧 [HOME] Normalizing portfolio block - AFTER:`, {
        align: block.attributes.align
      })
    }
  }

  if (typeof block.attributes.style === 'string') {
    try {
      block.attributes.style = JSON.parse(block.attributes.style.replace(/var:preset\|/g, ''))
      if (
        block.attributes.style.elements &&
        block.attributes.style.elements.link &&
        block.attributes.style.elements.link.color &&
        block.attributes.style.elements.link.color.text
      ) {
        const colorValue = block.attributes.style.elements.link.color.text.split('|')[1]
        block.attributes.style.textColor = colorValue
      }
    } catch (error) {
      console.error('Error parsing style attribute:', error)
      block.attributes.style = null
    }
  }

  if (typeof block.attributes.layout === 'string') {
    try {
      block.attributes.layout = JSON.parse(block.attributes.layout)
    } catch (error) {
      console.error('Error parsing layout attribute:', error)
      block.attributes.layout = null
    }
  }

  if (block.innerBlocks) {
    block.innerBlocks = block.innerBlocks
      .filter((childBlock): childBlock is EditorBlock => childBlock !== null)
      .map(childBlock => normalizeEditorBlock(childBlock as EditorBlock & { attributes?: any; children?: any[] }))
  }
  
  if ((block as any).children) {
    (block as any).children = (block as any).children
      .filter((childBlock: any): childBlock is EditorBlock => childBlock !== null)
      .map((childBlock: any) => normalizeEditorBlock(childBlock as EditorBlock & { attributes?: any; children?: any[] }))
  }

  return block
}

function flatListToHierarchical(data: (EditorBlock & { attributes?: any; children?: any[] })[] = [], { idKey = 'clientId', parentKey = 'parentClientId', childrenKey = 'children' }: HierarchicalOptions = {}): (EditorBlock & { attributes?: any; children?: any[] })[] {
  const tree: (EditorBlock & { attributes?: any; children?: any[] })[] = []
  const childrenOf: Record<string, (EditorBlock & { attributes?: any; children?: any[] })[]> = {}

  data.forEach(item => {
    const newItem: EditorBlock & { attributes?: any; children?: any[] } = { ...item }
    const parentId: string = (newItem as any)[parentKey] == null ? '0' : (newItem as any)[parentKey]

    childrenOf[(newItem as any)[idKey]] = childrenOf[(newItem as any)[idKey]] || []
    ;(newItem as any)[childrenKey] = childrenOf[(newItem as any)[idKey]]

    if (parentId !== '0') {
      childrenOf[parentId] = childrenOf[parentId] || []
      childrenOf[parentId].push(newItem)
    } else {
      tree.push(newItem)
    }
  })

  return tree.map(normalizeEditorBlock)
}

export const load: PageServerLoad = async function load({ params, url }) {
  const uri = '/'
  
  console.log('🚀 [HOME] Server load called for URI:', uri)
  
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
    console.log(`🔍 [HOME] Found ${allPortfolioBlocks.length} portfolio blocks (including nested)`)

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
      console.log('📊 [HOME] Page needs external projects data, fetching...')
      allProjects = await getAllProjects()
    } else {
      console.log('📊 [HOME] Page uses embedded project data, skipping external fetch')
    }

    // Recursively process portfolio blocks to resolve their projects
    const processBlocksRecursively = (blocks: any[]): any[] => {
      return blocks.map(block => {
        if (block.name === 'acf/portfolio-block') {
          console.log(`📊 [HOME] Found portfolio block!`, (block as any).portfolioBlock ? 'Has portfolioBlock data' : 'Missing portfolioBlock data')
          console.log(`📊 [HOME] Block attributes:`, block.attributes)
          
          if ((block as any).portfolioBlock) {
            const portfolioBlock = (block as any).portfolioBlock
            console.log(`📊 [HOME] Portfolio config:`, {
              projectSource: portfolioBlock.projectSource,
              specificProjectsCount: portfolioBlock.specificProjects?.nodes?.length || 0,
              displayMode: portfolioBlock.displayMode,
              blockAlign: block.attributes?.align
            })
            
            const resolvedProjects = resolvePortfolioProjects(portfolioBlock, allProjects)
            
            console.log(`🎯 [HOME] Portfolio block resolved ${resolvedProjects.length} projects (source: ${portfolioBlock.projectSource})`)
            
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

    console.log(`🔍 [HOME] Processing ${editorBlocks.length} editor blocks recursively...`)
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
