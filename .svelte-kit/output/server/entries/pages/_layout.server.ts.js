import { g as graphqlQuery, c as checkResponse } from "../../chunks/graphql.js";
import { e as error } from "../../chunks/index.js";
const Menu = 'query Menu {\n  menu(id: "primary_navigation", idType: LOCATION) {\n    menuItems {\n      nodes {\n        label\n        order\n        uri\n      }\n    }\n  }\n}';
const load = async function load2({ params, url }) {
  const uri = `/${params.all || ""}`;
  try {
    const response = await graphqlQuery(Menu, { uri });
    checkResponse(response);
    const { data } = await response.json();
    return {
      data
    };
  } catch (err) {
    const httpError = err;
    if (httpError.message) {
      throw error(httpError.status ?? 500, httpError.message);
    }
    throw error(500, err);
  }
};
export {
  load
};
