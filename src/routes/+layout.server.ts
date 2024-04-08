import PageMeta from '$lib/graphql/query/menu.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async function load({ params }) {
  const uri = `/${params.all || ''}`

  try {
    const response = await graphqlQuery(PageMeta, { uri: uri })
    checkResponse(response)
    const { data }: { data: CombinedQueryResponse } = await response.json()

    // If needed, add the 'current' key to menu nodes as you've done before
    if (data.menu && data.menu.menuItems && data.menu.menuItems.nodes) {
      data.menu.menuItems.nodes = data.menu.menuItems.nodes.map(node => ({
        ...node,
        current: node.uri === uri,
      }))
    }

    // Now `data` contains both your menu items and page SEO content

    return {
      menu: data.menu,
      seo: data.page.seo,
      uri: uri
    }
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      throw error(httpError.status ?? 500, httpError.message)
    }
    throw error(500, err as string)
  }
}
