export const prerender = true
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { urqlQuery } from '$lib/graphql/client'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/graphql/generated'
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
  
  const processedBreadcrumbs = breadcrumbs.map(crumb => ({
    ...crumb,
    url: crumb.url ? crumb.url.replace(backendOrigin, '') || '/' : undefined
  }))

  // For portfolio items, prepend "Work" breadcrumb if it doesn't already exist
  const hasWorkBreadcrumb = processedBreadcrumbs.some(crumb => 
    crumb.url === '/portfolio' || crumb.text?.toLowerCase().includes('work')
  )
  
  if (!hasWorkBreadcrumb) {
    processedBreadcrumbs.splice(1, 0, {
      text: 'Work',
      url: '/portfolio'
    })
  }
  
  return processedBreadcrumbs
}


function normalizeEditorBlock(block: EditorBlock & { attributes?: any }): EditorBlock & { attributes?: any } {
  // Ensure attributes exists before attempting to access it
  if (!block.attributes) {
    block.attributes = {} // Initialize with an empty object if it doesn't exist
  }

  if (block.name && block.name.startsWith('acf/')) {
    if ('alignment' in block.attributes) {
      // Prefer 'alignment' over 'align', but don't overwrite if 'align' already exists
      block.attributes.align = block.attributes.align || block.attributes.alignment
      // Remove the 'alignment' attribute to avoid confusion
      delete block.attributes.alignment
    }
  }

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
  if (block.innerBlocks) {
    block.innerBlocks = block.innerBlocks
      .filter((childBlock): childBlock is EditorBlock => childBlock !== null)
      .map(childBlock => normalizeEditorBlock(childBlock as EditorBlock & { attributes?: any }))
  }

  // Also handle children property for compatibility
  if ((block as any).children) {
    ;(block as any).children = (block as any).children
      .filter((childBlock: any): childBlock is EditorBlock => childBlock !== null)
      .map((childBlock: any) => normalizeEditorBlock(childBlock as EditorBlock & { attributes?: any }))
  }

  return block
}

function flatListToHierarchical(
  data: (EditorBlock & { attributes?: any })[] = [],
  { idKey = 'clientId', parentKey = 'parentClientId', childrenKey = 'children' }: HierarchicalOptions = {},
): (EditorBlock & { attributes?: any })[] {
  const tree: (EditorBlock & { attributes?: any })[] = []
  const childrenOf: Record<string, (EditorBlock & { attributes?: any })[]> = {}

  data.forEach(item => {
    const newItem: EditorBlock & { attributes?: any } = { ...item }
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

  return tree.map(normalizeEditorBlock) // Normalize each root level block
}

function createCategoryHierarchy(data: any[] = [], { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' }: HierarchicalOptions = {}): any[] {
  const tree: any[] = []
  const childrenOf: Record<string, any[]> = {}

  data.forEach(item => {
    const newItem: any = { ...item }
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

  return tree
}

export const load: PageServerLoad = async function load({ params, url }) {
  const uri = `/portfolio/${params.slug}`

  try {
    const data = await urqlQuery(PageContent, { uri: uri })

    if (data.nodeByUri === null) {
      error(404, {
        message: `Portfolio item "${params.slug}" not found`,
      })
    }

    let editorBlocks: (EditorBlock & { attributes?: any })[] = data.nodeByUri.editorBlocks ? flatListToHierarchical(data.nodeByUri.editorBlocks) : []
    
    // Set align to 'full' on all top-level blocks
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

    const backgroundColour = data.nodeByUri.backgroundColour?.backgroundColour ?? 'black'

    // Portfolio item specific data
    const portfolioData = {
      slug: params.slug,
      // Add any portfolio item-specific data fetching here
      // For example: related projects, project details, etc.
    }

    // Create hierarchical services structure
    const servicesHierarchy = data.nodeByUri?.nhtblServices?.nodes
      ? createCategoryHierarchy(data.nodeByUri.nhtblServices.nodes, {
          idKey: 'id',
          parentKey: 'parentId',
          childrenKey: 'children',
        })
      : []

    const services =
      data.nodeByUri?.nhtblServices?.nodes
        ?.filter(service => service?.parentId !== null && service?.parentId !== undefined)
        ?.map(service => service?.name)
        ?.filter(Boolean) ?? []
    // Create hierarchical clients structure
    const clients = data.nodeByUri?.nhtblClients?.nodes
    ?.map(client => client?.name)
      ?? []

      const formatYearRange = (startDate: string | null | undefined, endDate: string | null | undefined) => {
        // If both dates are empty, return empty string
        if (!startDate && !endDate) {
          return ''
        }
    
        // If start date is empty but end date exists, return just end year
        if (!startDate && endDate) {
          const endYear = new Date(endDate).getFullYear()
          return `(${endYear})`
        }
    
        // If end date is empty but start date exists, return just start year
        if (startDate && !endDate) {
          const startYear = new Date(startDate).getFullYear()
          return `(${startYear} –)`
        }
    
        // Both dates exist
        if (startDate && endDate) {
          const startYear = new Date(startDate).getFullYear()
          const endYear = new Date(endDate).getFullYear()
    
          if (startYear === endYear) {
            return `(${startYear})`
          } else {
            // Use last two digits of end year if different
            const endYearShort = endYear.toString().slice(-2)
            return `(${startYear}–${endYearShort})`
          }
        }
    
        return ''
      }
    
      const yearDisplay = formatYearRange(data.nodeByUri.projectData?.startDate, data.nodeByUri.projectData?.endDate)
      

      
    const returnData = {
      uri: uri,
      yearDisplay,
      excerpt: data.nodeByUri?.excerpt ?? '',
      backgroundColour: backgroundColour,
      editorBlocks: editorBlocks,
      portfolioData: portfolioData,
      services: services,
      clients: clients,
      // Portfolio item specific meta
      pageType: 'portfolio-item',
      title: data.nodeByUri.title || `Portfolio - ${params.slug}`,
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
