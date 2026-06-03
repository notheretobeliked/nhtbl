import { Client, fetchExchange } from '@urql/core'
import { GRAPHQL_ENDPOINT } from '$env/static/private'

export const client = new Client({
  url: GRAPHQL_ENDPOINT,
  // No document cache (cacheExchange): with SSR every request must reflect the
  // latest WordPress content. cacheExchange persisted responses in the server's
  // memory and served them stale. fetchExchange-only = fresh fetch every time;
  // cache: 'no-cache' below also bypasses the HTTP cache.
  exchanges: [fetchExchange],
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


  const result = await client.query(query, variables || {}, { 
    ...context 
  }).toPromise()
  
  
  if (result.error) {
    throw new Error(`GraphQL Error: ${result.error.message}`)
  }
  
  if (!result.data) {
    throw new Error('No data received from GraphQL query')
  }
  
  // Deep clone to ensure we only return plain objects that can be serialized
  return JSON.parse(JSON.stringify(result.data)) as T
}

export async function urqlMutation<T = any, V = Record<string, any>>(
  mutation: string,
  variables?: V,
  options?: { 
    token?: string;
    context?: Record<string, any>
  }
): Promise<T> {
  
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

  const result = await client.mutation(mutation, variables || {}, { 
    ...context 
  }).toPromise()
  
  if (result.error) {
    throw new Error(`GraphQL Error: ${result.error.message}`)
  }
  
  if (!result.data) {
    throw new Error('No data received from GraphQL mutation')
  }
  
  // Return the data directly
  return result.data as T
}