import { GRAPHQL_ENDPOINT } from '$env/static/private'
import { error } from '@sveltejs/kit'

export const checkResponse = (response: Response) => {
  const { headers, ok } = response
  if (!ok) {
    error(502, 'Bad Gateway');
  }

  if (!headers.get('content-type')?.includes('application/json')) {
    error(502, 'Bad Gateway: expected JSON data from GraphQL backend');
  }
}

export const graphqlQuery = async (query: string, variables: Record<string, any> = {}) => {
  return fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: 'no-cache',
  })
}
