import type { PostsQuery } from '$lib/generated/graphql'
import Projects from '$lib/graphql/query/projects.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

interface HierarchicalOptions {
  idKey?: string
  parentKey?: string
  childrenKey?: string
}


export const load: PageServerLoad = async function load({ params, url }) {
  const uri = `/${params.all || ''}`;

  try {
    const response = await graphqlQuery(Projects, { uri: uri })
    checkResponse(response)
    const { data }: { data: PostsQuery } = await response.json()

    if (data.page === null) {
      error(404, {
        message: 'Not found'
      });
    }

    
    return {
      data: data,
    }
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      throw error(httpError.status ?? 500, httpError.message)
    }
    throw error(500, err as string)
  }
}
