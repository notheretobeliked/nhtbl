import { Client, cacheExchange, fetchExchange } from "@urql/core";
const GRAPHQL_ENDPOINT = "http://nhtbl-backend.test/wp/graphql";
const client = new Client({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    cache: "no-cache"
  }
});
async function urqlQuery(query, variables) {
  const result = await client.query(query, variables || {}).toPromise();
  if (result.error) {
    throw new Error(`GraphQL Error: ${result.error.message}`);
  }
  if (!result.data) {
    throw new Error("No data received from GraphQL query");
  }
  return result.data;
}
export {
  urqlQuery as u
};
