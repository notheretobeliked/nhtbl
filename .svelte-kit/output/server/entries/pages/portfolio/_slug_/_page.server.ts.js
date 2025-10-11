import { P as PageContent } from "../../../../chunks/page.js";
import { u as urqlQuery, G as GRAPHQL_ENDPOINT } from "../../../../chunks/client.js";
import { error } from "@sveltejs/kit";
import { c as cleanNavigationUrls, m as makeUrlRelative } from "../../../../chunks/utilities.js";
const prerender = true;
function processBreadcrumbs(breadcrumbs = []) {
  if (!breadcrumbs || !Array.isArray(breadcrumbs)) {
    return [];
  }
  const backendUrl = new URL(GRAPHQL_ENDPOINT);
  const backendOrigin = backendUrl.origin;
  const processedBreadcrumbs = breadcrumbs.map((crumb) => ({
    ...crumb,
    url: makeUrlRelative(crumb.url, backendOrigin)
  }));
  const hasWorkBreadcrumb = processedBreadcrumbs.some(
    (crumb) => crumb.url === "/portfolio" || crumb.text?.toLowerCase().includes("work")
  );
  if (!hasWorkBreadcrumb) {
    processedBreadcrumbs.splice(1, 0, {
      text: "Work",
      url: "/portfolio"
    });
  }
  return processedBreadcrumbs;
}
function normalizeEditorBlock(block) {
  if (!block.attributes) {
    block.attributes = {};
  }
  if (block.name && block.name.startsWith("acf/")) {
    if ("alignment" in block.attributes) {
      block.attributes.align = block.attributes.align || block.attributes.alignment;
      delete block.attributes.alignment;
    }
  }
  if (typeof block.attributes.style === "string") {
    try {
      block.attributes.style = JSON.parse(block.attributes.style.replace(/var:preset\|/g, ""));
      if (block.attributes.style.elements && block.attributes.style.elements.link && block.attributes.style.elements.link.color && block.attributes.style.elements.link.color.text) {
        const colorValue = block.attributes.style.elements.link.color.text.split("|")[1];
        block.attributes.style.textColor = colorValue;
      }
    } catch (error2) {
      console.error("Error parsing style attribute:", error2);
      block.attributes.style = null;
    }
  }
  if (typeof block.attributes.layout === "string") {
    try {
      block.attributes.layout = JSON.parse(block.attributes.layout);
    } catch (error2) {
      console.error("Error parsing layout attribute:", error2);
      block.attributes.layout = null;
    }
  }
  if (block.innerBlocks) {
    block.innerBlocks = block.innerBlocks.filter((childBlock) => childBlock !== null).map((childBlock) => normalizeEditorBlock(childBlock));
  }
  if (block.children) {
    block.children = block.children.filter((childBlock) => childBlock !== null).map((childBlock) => normalizeEditorBlock(childBlock));
  }
  return block;
}
function flatListToHierarchical(data = [], { idKey = "clientId", parentKey = "parentClientId", childrenKey = "children" } = {}) {
  const tree = [];
  const childrenOf = {};
  data.forEach((item) => {
    const newItem = { ...item };
    const parentId = newItem[parentKey] == null ? "0" : newItem[parentKey];
    childrenOf[newItem[idKey]] = childrenOf[newItem[idKey]] || [];
    newItem[childrenKey] = childrenOf[newItem[idKey]];
    if (parentId !== "0") {
      childrenOf[parentId] = childrenOf[parentId] || [];
      childrenOf[parentId].push(newItem);
    } else {
      tree.push(newItem);
    }
  });
  return tree.map(normalizeEditorBlock);
}
function createCategoryHierarchy(data = [], { idKey = "id", parentKey = "parentId", childrenKey = "children" } = {}) {
  const tree = [];
  const childrenOf = {};
  data.forEach((item) => {
    const newItem = { ...item };
    const parentId = newItem[parentKey] == null ? "0" : newItem[parentKey];
    childrenOf[newItem[idKey]] = childrenOf[newItem[idKey]] || [];
    newItem[childrenKey] = childrenOf[newItem[idKey]];
    if (parentId !== "0") {
      childrenOf[parentId] = childrenOf[parentId] || [];
      childrenOf[parentId].push(newItem);
    } else {
      tree.push(newItem);
    }
  });
  return tree;
}
const load = async function load2({ params, url }) {
  const uri = `/portfolio/${params.slug}`;
  try {
    const data = await urqlQuery(PageContent, { uri });
    if (data.nodeByUri === null) {
      error(404, {
        message: `Portfolio item "${params.slug}" not found`
      });
    }
    let editorBlocks = data.nodeByUri.editorBlocks ? flatListToHierarchical(data.nodeByUri.editorBlocks) : [];
    editorBlocks = editorBlocks.map((block) => {
      const updatedBlock = {
        ...block,
        attributes: {
          ...block.attributes,
          align: "full"
        }
      };
      if (block.name === "core/columns") {
        updatedBlock.attributes = {
          ...updatedBlock.attributes,
          backgroundColor: "black"
        };
      }
      return updatedBlock;
    });
    const backgroundColour = data.nodeByUri.backgroundColour?.backgroundColour ?? "black";
    const portfolioData = {
      slug: params.slug
      // Add any portfolio item-specific data fetching here
      // For example: related projects, project details, etc.
    };
    const servicesHierarchy = data.nodeByUri?.nhtblServices?.nodes ? createCategoryHierarchy(data.nodeByUri.nhtblServices.nodes, {
      idKey: "id",
      parentKey: "parentId",
      childrenKey: "children"
    }) : [];
    const services = data.nodeByUri?.nhtblServices?.nodes?.filter((service) => service?.parentId !== null && service?.parentId !== void 0)?.map((service) => service?.name)?.filter(Boolean) ?? [];
    const clients = data.nodeByUri?.nhtblClients?.nodes?.map((client) => client?.name) ?? [];
    const formatYearRange = (startDate, endDate) => {
      if (!startDate && !endDate) {
        return "";
      }
      if (!startDate && endDate) {
        const endYear = new Date(endDate).getFullYear();
        return `(${endYear})`;
      }
      if (startDate && !endDate) {
        const startYear = new Date(startDate).getFullYear();
        return `(${startYear} –)`;
      }
      if (startDate && endDate) {
        const startYear = new Date(startDate).getFullYear();
        const endYear = new Date(endDate).getFullYear();
        if (startYear === endYear) {
          return `(${startYear})`;
        } else {
          const endYearShort = endYear.toString().slice(-2);
          return `(${startYear}–${endYearShort})`;
        }
      }
      return "";
    };
    const yearDisplay = formatYearRange(data.nodeByUri.projectData?.startDate, data.nodeByUri.projectData?.endDate);
    const returnData = {
      uri,
      yearDisplay,
      excerpt: data.nodeByUri?.excerpt ?? "",
      backgroundColour,
      editorBlocks,
      portfolioData,
      services,
      clients,
      // Portfolio item specific meta
      pageType: "portfolio-item",
      title: data.nodeByUri.title || `Portfolio - ${params.slug}`,
      breadcrumbs: processBreadcrumbs(data.nodeByUri?.seo?.breadcrumbs)
    };
    const backendUrl = new URL(GRAPHQL_ENDPOINT);
    const cleanedData = cleanNavigationUrls(returnData, backendUrl.origin);
    return JSON.parse(JSON.stringify(cleanedData));
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
