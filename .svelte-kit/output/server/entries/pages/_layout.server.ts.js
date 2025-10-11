import { u as urqlQuery } from "../../chunks/client.js";
import { error } from "@sveltejs/kit";
const PageMeta = 'query PageMeta($uri: String!) {\n  menu(id: "primary_navigation", idType: LOCATION) {\n    menuItems {\n      nodes {\n        label\n        order\n        uri\n      }\n    }\n  }\n  nodeByUri(uri: $uri) {\n    ... on Page {\n      seo {\n        metaDesc\n        metaKeywords\n        opengraphSiteName\n        opengraphTitle\n        opengraphPublisher\n        opengraphUrl\n        title\n        twitterDescription\n        twitterTitle\n        breadcrumbs {\n          text\n          url\n        }\n        twitterImage {\n          altText\n          caption\n          mediaDetails {\n            ...MediaDetailsFragment\n          }\n        }\n        opengraphImage {\n          altText\n          caption\n          mediaDetails {\n            ...MediaDetailsFragment\n          }\n        }\n      }\n    }\n    ... on Nhtbl_project {\n      seo {\n        metaDesc\n        metaKeywords\n        opengraphSiteName\n        opengraphTitle\n        opengraphPublisher\n        opengraphUrl\n        title\n        twitterDescription\n        twitterTitle\n        breadcrumbs {\n          text\n          url\n        }\n        twitterImage {\n          altText\n          caption\n          mediaDetails {\n            ...MediaDetailsFragment\n          }\n        }\n        opengraphImage {\n          altText\n          caption\n          mediaDetails {\n            ...MediaDetailsFragment\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment MediaDetailsFragment on MediaDetails {\n  sizes {\n    name\n    sourceUrl\n    width\n    height\n  }\n}';
const PUBLIC_SITE_URL = "https://notheretobeliked.studio";
const load = async function load2({ url }) {
  const uri = url.pathname;
  try {
    const data = await urqlQuery(PageMeta, { uri });
    if (data.menu && data.menu.menuItems && data.menu.menuItems.nodes) {
      data.menu.menuItems.nodes = data.menu.menuItems.nodes.map((node) => ({
        ...node,
        current: node.uri === uri
      }));
    }
    if (!data.nodeByUri || !data.nodeByUri.seo) {
      const fallbackData = {
        menu: JSON.parse(JSON.stringify(data.menu)),
        // Deep clone menu to remove any hidden references
        seo: {
          title: "Page Not Found",
          metaDesc: "",
          opengraphUrl: `${PUBLIC_SITE_URL}${uri}`,
          opengraphSiteName: "Not here to be liked",
          opengraphTitle: "Page Not Found",
          twitterTitle: "Page Not Found",
          twitterDescription: "",
          metaKeywords: "",
          opengraphPublisher: "",
          twitterImage: null,
          opengraphImage: null,
          breadcrumbs: []
        },
        uri
      };
      return JSON.parse(JSON.stringify(fallbackData));
    }
    const siteUrl = data.nodeByUri.seo.opengraphUrl.replace(new URL(data.nodeByUri.seo.opengraphUrl).origin, PUBLIC_SITE_URL);
    const returnData = {
      menu: data.menu,
      seo: { ...data.nodeByUri.seo, opengraphUrl: siteUrl },
      uri
    };
    return JSON.parse(JSON.stringify(returnData));
  } catch (err) {
    const httpError = err;
    if (httpError.message) {
      error(httpError.status ?? 500, httpError.message);
    }
    error(500, err);
  }
};
export {
  load
};
