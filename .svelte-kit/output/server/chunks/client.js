import { Client, cacheExchange, fetchExchange } from "@urql/core";
const GRAPHQL_ENDPOINT = "http://nhtbl-backend.test/wp/graphql";
const WORDPRESS_URL = "http://nhtbl-backend.test/";
const client = new Client({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
  // No cache in dev, cache in prod
  fetchOptions: {
    cache: "no-cache"
  }
});
async function urqlQuery(query, variables, options) {
  const context = {
    ...options?.context,
    fetchOptions: {
      ...options?.context?.fetchOptions,
      headers: {
        ...options?.context?.fetchOptions?.headers,
        ...options?.token && {
          "Authorization": `Bearer ${options.token}`
        }
      }
    }
  };
  const result = await client.query(query, variables || {}, {
    ...context
  }).toPromise();
  if (result.error) {
    throw new Error(`GraphQL Error: ${result.error.message}`);
  }
  if (!result.data) {
    throw new Error("No data received from GraphQL query");
  }
  return JSON.parse(JSON.stringify(result.data));
}
export {
  GRAPHQL_ENDPOINT as G,
  WORDPRESS_URL as W,
  urqlQuery as u
};
