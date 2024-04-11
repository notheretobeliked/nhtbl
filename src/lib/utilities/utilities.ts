export interface HierarchicalOptions {
  idKey?: string
  parentKey?: string
  childrenKey?: string
}

export interface ContentSegment {
    type: 'text' | 'svg'
    content: string
    version: 'line' | 'bubble' // Add this line
    key: string // Unique key for each segment
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
    let index = 0 // Initialize an index counter

    doc.body.childNodes.forEach(node => {
      let type: 'text' | 'svg' = 'text'
      let content = node.textContent || ''
      let version: 'line' | 'bubble' = 'bubble'
      // Increment index for each segment to ensure uniqueness
      const key = `${type}-${content.substring(0, 10)}-${index++}`

      if (node.nodeName === 'SPAN' && node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        if (element.style.textDecoration.includes('underline')) {
          type = 'svg'
          content = element.innerHTML // Use innerHTML to preserve nested formatting
          version = 'line'
        } else {
          content = element.outerHTML // For non-underlined spans
        }
      } else if (node.nodeName === 'STRONG') {
        type = 'svg'
        version = 'bubble'
      } // Add more conditions as needed

      segments.push({ type, content, version, key })
    })

    return segments
  }