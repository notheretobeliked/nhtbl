export const prerender = true

import Projects from '$lib/graphql/query/projects.graphql?raw'
import { urqlQuery } from '$lib/graphql/client'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

interface HierarchicalOptions {
  idKey?: string
  parentKey?: string
  childrenKey?: string
}

export const load: PageServerLoad = async function load({ params }) {
  const uri = `/${params.all || ''}`

  try {
    const data = await urqlQuery(Projects, { uri: '/portfolio' })

    if (data.nodeByUri === null) {
      error(404, {
        message: 'Not found',
      })
    }

    return JSON.parse(JSON.stringify({ data: data }))
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      error(httpError.status ?? 500, httpError.message);
    }
    error(500, err as string);
  }
}
