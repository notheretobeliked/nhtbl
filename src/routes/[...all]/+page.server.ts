export const prerender = true;

import type { PostsQuery } from '$lib/generated/graphql'
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

interface HierarchicalOptions {
  idKey?: string
  parentKey?: string
  childrenKey?: string
}

function normalizeEditorBlock(block: any) {
  // Ensure attributes exists before attempting to access it
  if (!block.attributes) {
    block.attributes = {}; // Initialize with an empty object if it doesn't exist
  }

  if (block.name.startsWith('acf/')) {
    if ('alignment' in block.attributes) {
      // Prefer 'alignment' over 'align', but don't overwrite if 'align' already exists
      block.attributes.align = block.attributes.align || block.attributes.alignment;
      // Remove the 'alignment' attribute to avoid confusion
      delete block.attributes.alignment;
    }
  }

  // Normalize child blocks recursively
  if (block.children) {
    block.children = block.children.map(normalizeEditorBlock);
  }

  return block;
}


function flatListToHierarchical<T extends Record<string, any>>(
  data: T[] = [],
  { idKey = 'clientId', parentKey = 'parentClientId', childrenKey = 'children' }: HierarchicalOptions = {},
): T[] {
  const tree: T[] = []
  const childrenOf: Record<string, T[]> = {}

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

  return tree.map(normalizeEditorBlock); // Normalize each root level block
}

export const load: PageServerLoad = async function load({ params, url }) {
  const uri = `/${params.all || ''}`;

  try {
    const response = await graphqlQuery(PageContent, { uri: uri })
    checkResponse(response)
    const { data }: { data: PostsQuery } = await response.json()

    if (data.page === null) {
      error(404, {
        message: 'Not found'
      });
    }

    let editorBlocks = data.page.editorBlocks ? flatListToHierarchical(data.page.editorBlocks) : [];

    return {
      data: data,
      uri: uri,
      editorBlocks: editorBlocks
    }
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      throw error(httpError.status ?? 500, httpError.message)
    }
    throw error(500, err as string)
  }
}
