// @ts-nocheck
import Menu from '$lib/graphql/query/menu.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load = async function load({ params, url }: Parameters<PageServerLoad>[0]) {
    const uri = `/${params.all || ''}`
  
    try {
      const response = await graphqlQuery(Menu, { uri: uri })
      checkResponse(response)
      const { data }: { data: PostsQuery } = await response.json()  
  
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
  