import PageMeta from '$lib/graphql/query/menu.graphql?raw'
import type { LayoutAPIResponse } from '$lib/types/wp-types'
import { urqlQuery } from '$lib/graphql/client'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { PUBLIC_SITE_URL } from '$env/static/public'

export const load: PageServerLoad = async function load({ url }) {
  const uri = url.pathname

  try {
    const data: LayoutAPIResponse = await urqlQuery(PageMeta, { uri: uri })


    // Modify menu items to add 'current' key
    if (data.menu && data.menu.menuItems && data.menu.menuItems.nodes) {
      data.menu.menuItems.nodes = data.menu.menuItems.nodes.map(node => ({
        ...node,
        current: node.uri === uri,
      }))
    }

    // Check if page exists and has SEO data
    if (!data.nodeByUri || !data.nodeByUri.seo) {
      // Return menu data even if page doesn't exist, use defaults for SEO
      const fallbackData = {
        menu: JSON.parse(JSON.stringify(data.menu)), // Deep clone menu to remove any hidden references
        seo: {
          title: 'Page Not Found',
          metaDesc: '',
          opengraphUrl: `${PUBLIC_SITE_URL}${uri}`,
          opengraphSiteName: 'Not here to be liked',
          opengraphTitle: 'Page Not Found',
          twitterTitle: 'Page Not Found',
          twitterDescription: '',
          metaKeywords: '',
          opengraphPublisher: '',
          twitterImage: null,
          opengraphImage: null,
          breadcrumbs: []
        },
        uri: uri,
      }
      
      return JSON.parse(JSON.stringify(fallbackData))
    }

    const siteUrl = data.nodeByUri.seo.opengraphUrl.replace(new URL(data.nodeByUri.seo.opengraphUrl).origin, PUBLIC_SITE_URL);

    const returnData = {
      menu: data.menu,
      seo: { ...data.nodeByUri.seo, opengraphUrl: siteUrl },
      uri: uri,
    }
    
    return JSON.parse(JSON.stringify(returnData))
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      error(httpError.status ?? 500, httpError.message)
    }
    error(500, err as string)
  }
}
