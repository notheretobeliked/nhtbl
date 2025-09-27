import { u as urqlQuery } from "../../chunks/client.js";
import { e as error } from "../../chunks/index.js";
const PageMeta = 'query PageMeta($uri: ID!) {\n  menu(id: "primary_navigation", idType: LOCATION) {\n    menuItems {\n      nodes {\n        label\n        order\n        uri\n      }\n    }\n  }\n  page(id: $uri, idType: URI) {\n    seo {\n  metaDesc\n  metaKeywords\n  opengraphSiteName\n  opengraphTitle\n  opengraphPublisher\n  opengraphUrl\n  title\n  twitterDescription\n  twitterTitle\n  twitterImage {\n    altText\n    caption\n    mediaDetails {\n      ...MediaDetailsFragment\n    }\n  }\n  opengraphImage {\n    altText\n    caption\n    mediaDetails {\n      ...MediaDetailsFragment\n    }\n  }\n    }\n  }\n}\n\n\nfragment MediaDetailsFragment on MediaDetails {\n  sizes {\n    name\n    sourceUrl\n    width\n    height\n  }\n}\n\n';
const PUBLIC_SITE_URL = "https://notheretobeliked.studio";
const load = async function load2({ params }) {
  const uri = `/${params.all || ""}`;
  try {
    const data = await urqlQuery(PageMeta, { uri });
    if (data.menu && data.menu.menuItems && data.menu.menuItems.nodes) {
      data.menu.menuItems.nodes = data.menu.menuItems.nodes.map((node) => ({
        ...node,
        current: node.uri === uri
      }));
    }
    const siteUrl = data.page.seo.opengraphUrl.replace(new URL(data.page.seo.opengraphUrl).origin, PUBLIC_SITE_URL);
    return {
      data,
      menu: data.menu,
      seo: { ...data.page.seo, opengraphUrl: siteUrl },
      // Update seo with the new siteUrl
      uri
    };
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
