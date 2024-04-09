// @ts-nocheck
export const prerender = true
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import type { PageData } from '../$types'

interface HierarchicalOptions {
  idKey?: string
  parentKey?: string
  childrenKey?: string
}

function normalizeEditorBlock(block: EditorBlock) {
  // Ensure attributes exists before attempting to access it
  if (!block.attributes) {
    block.attributes = {} // Initialize with an empty object if it doesn't exist
  }

  if (block.name.startsWith('acf/')) {
    if ('alignment' in block.attributes) {
      // Prefer 'alignment' over 'align', but don't overwrite if 'align' already exists
      block.attributes.align = block.attributes.align || block.attributes.alignment
      // Remove the 'alignment' attribute to avoid confusion
      delete block.attributes.alignment
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
    const newItem: T = { ...item }
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

  try {
    const response = await graphqlQuery(PageContent, { uri: uri })
    checkResponse(response)
    const { data }: { data: PageData } = await response.json()

    if (data.page === null) {
      error(404, {
        message: 'Not found',
      })
    }

    let editorBlocks: EditorBlock[] = data.page.editorBlocks ? flatListToHierarchical(data.page.editorBlocks) : []

    const backgroundColour = data.page.backgroundColour.backgroundColour ?? 'white'

    return {
      data: data,
      uri: uri,
      backgroundColour: backgroundColour,
      editorBlocks: editorBlocks,
    }
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      throw error(httpError.status ?? 500, httpError.message)
    }
    throw error(500, err as string)
  }
}
