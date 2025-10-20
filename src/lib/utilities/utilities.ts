import type { ImageSize } from "$lib/types/wp-types"
import type { EditorBlock } from "$lib/graphql/generated"
import type { HierarchicalOptions } from "./wordpress-content"

export interface ContentSegment {
  type: 'text' | 'svg'
  content: string
  version: 'line' | 'bubble' // Add this line
  key: string // Unique key for each segment
}

export const flatListToHierarchical = <T extends Record<string, any>>(
  data: T[] = [],
  { idKey = 'clientId', parentKey = 'parentClientId', childrenKey = 'children' }: HierarchicalOptions = {},
): T[] => {
  const tree: T[] = []
  const childrenOf: Record<string, T[]> = {}

  data.forEach(item => {
    const newItem: any = { ...item }
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

export const parseContent = (htmlContent: string): ContentSegment[] => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const segments: ContentSegment[] = []
  let index = 0 // Initialize an index counter

  doc.body.childNodes.forEach(node => {
    let type: 'text' | 'svg' = 'text'
    let content = ''
    let version: 'line' | 'bubble' = 'bubble'

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
      content = (node as HTMLElement).innerHTML // Preserve content inside strong tags
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // For other element nodes (including <a>, <em>, etc.), preserve the HTML
      content = (node as HTMLElement).outerHTML
    } else {
      // For text nodes, use textContent
      content = node.textContent || ''
    }
    
    // Increment index for each segment to ensure uniqueness
    const key = `${type}-${content.substring(0, 10)}-${index++}`
    segments.push({ type, content, version, key })
  })

  return segments
}

export const findImageSizeData = (property: keyof ImageSize, sizes: ImageSize[], name: string): string => {
  const size = sizes.find(size => size.name === name)
  if (size && property in size) {
    return String(size[property])
  }
  return ''
}

export const getSrcSet = (sizes: ImageSize[]): string => {
  return sizes.map(({ sourceUrl, width }) => `${sourceUrl} ${width}w`).join(', ')
}

/**
 * Removes backend hostname from URLs to make them relative
 * @param url - The URL to clean
 * @param backendOrigin - The backend origin to remove (e.g., "http://nhtbl-backend.test")
 * @returns Relative URL or original URL if it doesn't start with backend origin
 */
export const makeUrlRelative = (url: string | null | undefined, backendOrigin: string): string | undefined => {
  if (!url) return undefined
  
  // Extract hostname from backend origin to match both http and https
  const backendUrl = new URL(backendOrigin)
  const backendHostname = backendUrl.hostname
  
  try {
    const urlObj = new URL(url)
    // If the hostname matches our backend, make it relative
    if (urlObj.hostname === backendHostname) {
      const relativeUrl = urlObj.pathname + urlObj.search + urlObj.hash
      return relativeUrl || '/'
    }
  } catch {
    // If URL parsing fails, fall back to simple string matching
    if (url.startsWith(backendOrigin)) {
      const relativeUrl = url.replace(backendOrigin, '')
      return relativeUrl || '/'
    }
  }
  
  return url
}

/**
 * Recursively cleans navigation URLs in an object structure while preserving media URLs
 * @param obj - Object that may contain URLs
 * @param backendOrigin - The backend origin to remove
 * @param navigationUrlFields - Array of field names that contain navigation URLs (not media)
 */
export const cleanNavigationUrls = (
  obj: any, 
  backendOrigin: string, 
  navigationUrlFields: string[] = ['url', 'uri', 'href', 'link']
): any => {
  if (!obj || typeof obj !== 'object') return obj
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanNavigationUrls(item, backendOrigin, navigationUrlFields))
  }
  
  const cleaned = { ...obj }
  
  for (const [key, value] of Object.entries(cleaned)) {
    if (navigationUrlFields.includes(key) && typeof value === 'string') {
      cleaned[key] = makeUrlRelative(value, backendOrigin)
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanNavigationUrls(value, backendOrigin, navigationUrlFields)
    }
  }
  
  // Special handling for block attributes that might contain URLs
  if (cleaned.attributes && typeof cleaned.attributes === 'object') {
    for (const [key, value] of Object.entries(cleaned.attributes)) {
      if (navigationUrlFields.includes(key) && typeof value === 'string') {
        cleaned.attributes[key] = makeUrlRelative(value, backendOrigin)
      }
    }
  }
  
  return cleaned
}
