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

function flatListToHierarchical<T extends Record<string, any>>(
  data: T[] = [],
  { idKey = 'clientId', parentKey = 'parentClientId', childrenKey = 'children' }: HierarchicalOptions = {},
): T[] {
  const tree: T[] = []
  const childrenOf: Record<string, T[]> = {}

  data.forEach(item => {
    const newItem: T = { ...item }
    // Adjusted to handle both undefined and null as "0" (root)
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
  const uri = `/${params.all || ''}`

  try {
    const response = await graphqlQuery(PageContent, { uri: uri })
    checkResponse(response)
    const { data }: { data: PostsQuery } = await response.json()

    if (!data) {
      throw error(404, 'Page not found')
    }
	

    const editorBlocks = flatListToHierarchical(data.page.editorBlocks)

    return {
      data: data,
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
