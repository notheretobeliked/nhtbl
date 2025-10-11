import type { ExtendedEditorBlock } from '$lib/types/wp-types'
import type { EditorBlock } from '$lib/graphql/generated'

export interface HierarchicalOptions {
  idKey?: string
  parentKey?: string
  childrenKey?: string
}

/**
 * Normalizes editor block attributes by parsing JSON strings and handling special cases
 */
export function normalizeEditorBlock(block: ExtendedEditorBlock): ExtendedEditorBlock
export function normalizeEditorBlock(block: EditorBlock & { attributes?: any; children?: any[]; innerBlocks?: any[] }): EditorBlock & { attributes?: any; children?: any[]; innerBlocks?: any[] }
export function normalizeEditorBlock(block: any): any {
  if (!block.attributes) {
    block.attributes = {}
  }

  // Parse style attribute if it's a string
  if (typeof block.attributes.style === 'string') {
    try {
      block.attributes.style = JSON.parse(block.attributes.style.replace(/var:preset\|/g, ''))
      
      // Handle special color attributes
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
      block.attributes.style = null
    }
  }

  // Parse layout attribute if it's a string
  if (typeof block.attributes.layout === 'string') {
    try {
      block.attributes.layout = JSON.parse(block.attributes.layout)
    } catch (error) {
      block.attributes.layout = null
    }
  }

  // Recursively normalize children (ExtendedEditorBlock uses 'children')
  if (block.children) {
    block.children = block.children.map(normalizeEditorBlock)
  }

  // Handle innerBlocks (EditorBlock uses 'innerBlocks')
  if (block.innerBlocks) {
    block.innerBlocks = block.innerBlocks
      .filter((childBlock: any) => childBlock !== null)
      .map((childBlock: any) => normalizeEditorBlock(childBlock))
  }

  return block
}

/**
 * Converts a flat list of editor blocks to a hierarchical structure based on parent-child relationships
 */
export function flatListToHierarchical(
  data: ExtendedEditorBlock[] = [], 
  { idKey = 'clientId', parentKey = 'parentClientId', childrenKey = 'children' }: HierarchicalOptions = {}
): ExtendedEditorBlock[] {
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

  return tree.map(normalizeEditorBlock)
}

/**
 * Creates a hierarchical structure from category/taxonomy data
 */
export function createCategoryHierarchy(
  data: any[] = [], 
  { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' }: HierarchicalOptions = {}
): any[] {
  const tree: any[] = []
  const childrenOf: Record<string, any[]> = {}

  data.forEach(item => {
    const newItem: any = { ...item }
    const id: string = newItem[idKey]
    const parentId: string = newItem[parentKey] || null

    childrenOf[id] = childrenOf[id] || []
    newItem[childrenKey] = childrenOf[id]

    if (parentId && parentId !== '0') {
      childrenOf[parentId] = childrenOf[parentId] || []
      childrenOf[parentId].push(newItem)
    } else {
      tree.push(newItem)
    }
  })

  return tree
}

/**
 * Processes breadcrumb data by cleaning URLs and ensuring proper format
 */
export function processBreadcrumbs(breadcrumbs: any[] = [], backendOrigin?: string) {
  if (!breadcrumbs || !Array.isArray(breadcrumbs)) {
    return []
  }
  
  return breadcrumbs.map(crumb => {
    const processed = { ...crumb }
    
    // Clean URLs if backend origin is provided
    if (backendOrigin && processed.url) {
      processed.url = processed.url.replace(backendOrigin, '') || '/'
    }
    
    return processed
  })
}