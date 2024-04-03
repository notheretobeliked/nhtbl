import { g as graphqlQuery, c as checkResponse } from "../../../chunks/graphql.js";
import { e as error } from "../../../chunks/index.js";
const Projects = "query Projects {\n  nhtblProjects(first: 100) {\n    nodes {\n      imageGallery {\n        imageGallery {\n          nodes {\n            altText\n            mediaDetails {\n              sizes {\n                sourceUrl\n                width\n                height\n                name\n              }\n            }\n          }\n        }\n      }\n      content(format: RENDERED)\n      slug\n      uri\n      featuredImage {\n        node {\n          altText\n          mediaDetails {\n            sizes {\n              height\n              width\n              name\n              sourceUrl\n            }\n          }\n        }\n      }\n    }\n  }\n}";
const prerender = true;
const load = async function load2({ params, url }) {
  const uri = `/${params.all || ""}`;
  try {
    const response = await graphqlQuery(Projects, { uri });
    checkResponse(response);
    const { data } = await response.json();
    if (data.page === null) {
      error(404, {
        message: "Not found"
      });
    }
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
  load,
  prerender
};
