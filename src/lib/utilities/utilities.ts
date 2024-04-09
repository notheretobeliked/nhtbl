export interface HierarchicalOptions {
  idKey?: string
  parentKey?: string
  childrenKey?: string
}

export interface ContentSegment {
  type: 'text' | 'svg'
  content: string
  version: 'line' | 'bubble'
}

export function flatListToHierarchical<T extends Record<string, any>>(
  data: T[] = [],
  { idKey = 'clientId', parentKey = 'parentId', childrenKey = 'children' }: HierarchicalOptions = {},
): T[] {
  const tree: T[] = []
  const childrenOf: Record<string, T[]> = {}

  data.forEach(item => {
    const newItem: T = { ...item }
    const id: string = newItem[idKey]
    const parentId: string = newItem[parentKey] || '0'

    childrenOf[id] = childrenOf[id] || []
    newItem[childrenKey] = childrenOf[id]

    if (parentId !== '0') {
      childrenOf[parentId] = childrenOf[parentId] || []
      childrenOf[parentId].push(newItem)
    } else {
      tree.push(newItem)
    }
  })

  return tree
}

export function parseContent(htmlContent: string): ContentSegment[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const segments: ContentSegment[] = []

  doc.body.childNodes.forEach(node => {
    if (node.nodeName === 'SPAN' && node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      if (element.style.textDecoration.includes('underline')) {
        segments.push({ type: 'svg', content: element.innerHTML, version: 'line' })
      } else {
        segments.push({ type: 'text', content: element.outerHTML, version: 'bubble' })
      }
    } else if (node.nodeName === 'STRONG') {
      segments.push({ type: 'svg', content: node.textContent || '', version: 'bubble' })
    } else if (node.nodeType === Node.TEXT_NODE) {
      segments.push({ type: 'text', content: node.textContent || '', version: 'bubble' })
    } else {
      segments.push({ type: 'text', content: node.textContent || '', version: 'bubble' })
    }
  })

  return segments
}
