import { Client, cacheExchange, fetchExchange } from '@urql/core'
import { browser } from '$app/environment'

// Browser-only client for client-side queries
// You would need to add PUBLIC_GRAPHQL_ENDPOINT to .env if you want to use this
export const browserClient = browser ? new Client({
  url: '/api/graphql', // Update this with your GraphQL endpoint
  exchanges: [cacheExchange, fetchExchange],
}) : null