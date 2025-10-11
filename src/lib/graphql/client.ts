import { Client, cacheExchange, fetchExchange } from '@urql/core'
import { GRAPHQL_ENDPOINT } from '$env/static/private'
import { dev } from '$app/environment'

export const client = new Client({
  url: GRAPHQL_ENDPOINT,
  exchanges: dev ? [fetchExchange] : [cacheExchange, fetchExchange], // No cache in dev, cache in prod
  fetchOptions: {
    cache: 'no-cache'
  }
})

export async function urqlQuery<T = any, V = Record<string, any>>(
  query: string,
  variables?: V,
  options?: { 
    token?: string;
    context?: Record<string, any>
  }
): Promise<T> {
  console.log('🔍 URQL Query Debug:')
  console.log('Variables:', variables)
  console.log('Has token:', !!options?.token)
  
  // Create context with auth headers if token is provided
  const context = {
    ...options?.context,
    fetchOptions: {
      ...options?.context?.fetchOptions,
      headers: {
        ...options?.context?.fetchOptions?.headers,
        ...(options?.token && { 
          'X-Preview-Token': options.token
        })
      }
    }
  }

  console.log('Context headers:', context.fetchOptions?.headers)

  const result = await client.query(query, variables || {}, { 
    ...context 
  }).toPromise()
  
  console.log('URQL Result:', {
    hasError: !!result.error,
    hasData: !!result.data,
    errorMessage: result.error?.message,
    dataKeys: result.data ? Object.keys(result.data) : []
  })
  
  if (result.error) {
    console.error('GraphQL Error details:', result.error)
    throw new Error(`GraphQL Error: ${result.error.message}`)
  }
  
  if (!result.data) {
    console.error('No data in GraphQL response')
    throw new Error('No data received from GraphQL query')
  }
  
  // Deep clone to ensure we only return plain objects that can be serialized
  return JSON.parse(JSON.stringify(result.data)) as T
}