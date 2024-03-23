// @ts-nocheck
import type { PostsQuery } from '$lib/generated/graphql'
import HomePageContent from '$lib/graphql/query/homepage.graphql?raw'
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

const content =
  '<p><strong>Not here to be liked</strong> is a digital-first design and strategy studio committed to change through action. </p><p>We help organisations and movements use storytelling, memes and design to shift narratives and move hearts.</p>'
const images = [
  {
    url: '/breakdown/drought_1500.jpg',
    alt: 'weewoo',
  },
  {
    url: '/breakdown/climate-chaos.jpg',
    alt: 'weewoo',
  },
  {
    url: '/breakdown/police2.webp',
    alt: 'weewoo',
  },
  {
    url: '/breakdown/earthonfire.jpeg',
    alt: 'weewoo',
  },
  {
    url: '/breakdown/forest-fire-lg.jpg',
    alt: 'weewoo',
  },
  {
    url: '/breakdown/polarbear.avif',
    alt: 'weewoo',
  },
  {
    url: '/breakdown/bg.jpg',
    alt: 'weewoo',
  },
  {
    url: '/breakdown/police.jpeg',
    alt: 'weewoo',
  },
]
export const load = async function load({ url }: Parameters<PageServerLoad>[0]) {
  try {
    const response = await graphqlQuery(HomePageContent, { uri: '/' })
    checkResponse(response)
    const { data }: { data: PostsQuery } = await response.json()
    if (!data) {
      throw error(502, 'Unexpected JSON repsonse')
    }

    const editorBlocks = flatListToHierarchical(data.page.editorBlocks)

    return {
      images: images,
      content: content,
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
