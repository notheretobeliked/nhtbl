import { e as error } from "./index.js";
const GRAPHQL_ENDPOINT = "http://nhtbl-backend.test/wp/graphql";
function checkResponse(response) {
  const { headers, ok } = response;
  if (!ok) {
    throw error(502, "Bad Gateway");
  }
  if (!headers.get("content-type")?.includes("application/json")) {
    throw error(502, "Bad Gateway: expected JSON data from GraphQL backend");
  }
}
async function graphqlQuery(query, variables = {}) {
  return fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    }),
    cache: "no-cache"
    // This tells the fetch to bypass the cache
  });
}
export {
  checkResponse as c,
  graphqlQuery as g
};
