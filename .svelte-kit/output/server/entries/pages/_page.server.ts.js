import { P as PageContent } from "../../chunks/page.js";
import { u as urqlQuery, G as GRAPHQL_ENDPOINT } from "../../chunks/client.js";
import { error } from "@sveltejs/kit";
import { g as getAllProjects } from "../../chunks/projectsCache.js";
import { r as resolvePortfolioProjects } from "../../chunks/portfolioResolver.js";
import { c as cleanNavigationUrls } from "../../chunks/utilities.js";
const prerender = true;
function processBreadcrumbs(breadcrumbs = []) {
  if (!breadcrumbs || !Array.isArray(breadcrumbs)) {
    return [];
  }
  const backendUrl = new URL(GRAPHQL_ENDPOINT);
  const backendOrigin = backendUrl.origin;
  return breadcrumbs.map((crumb) => ({
    ...crumb,
    url: crumb.url ? crumb.url.replace(backendOrigin, "") || "/" : void 0
  }));
}
function normalizeEditorBlock(block) {
  if (!block.attributes) {
    block.attributes = {};
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
const load = async function load2({ params, url }) {
  const uri = "/";
  console.log("🚀 [HOME] Server load called for URI:", uri);
  try {
    const data = await urqlQuery(PageContent, { uri });
    if (data.nodeByUri === null) {
      error(404, {
        message: "Not found"
      });
    }
    let editorBlocks = data.nodeByUri.editorBlocks ? flatListToHierarchical(data.nodeByUri.editorBlocks) : [];
    const findPortfolioBlocks = (blocks) => {
      const portfolioBlocks = [];
      const searchBlocks = (blockList) => {
        blockList.forEach((block) => {
          if (block.name === "acf/portfolio-block") {
            portfolioBlocks.push(block);
          }
          if (block.children && Array.isArray(block.children)) {
            searchBlocks(block.children);
          }
          if (block.innerBlocks && Array.isArray(block.innerBlocks)) {
            searchBlocks(block.innerBlocks);
          }
        });
      };
      searchBlocks(blocks);
      return portfolioBlocks;
    };
    const allPortfolioBlocks = findPortfolioBlocks(editorBlocks);
    const needsAllProjects = allPortfolioBlocks.some((block) => {
      if (block.portfolioBlock) {
        const config = block.portfolioBlock;
        return config.projectSource === "all" || config.projectSource === "by_service" || config.projectSource === "specific" && (!config.specificProjects?.nodes?.[0]?.title || !config.specificProjects?.nodes?.[0]?.featuredImage);
      }
      return false;
    });
    let allProjects = [];
    if (needsAllProjects) {
      allProjects = await getAllProjects();
    }
    const processBlocksRecursively = (blocks) => {
      return blocks.map((block) => {
        if (block.name === "acf/portfolio-block") {
          if (block.portfolioBlock) {
            const portfolioBlock = block.portfolioBlock;
            const resolvedProjects = resolvePortfolioProjects(portfolioBlock, allProjects);
            return {
              ...block,
              resolvedProjects
            };
          }
        }
        const processedBlock = { ...block };
        if (block.children && Array.isArray(block.children)) {
          processedBlock.children = processBlocksRecursively(block.children);
        }
        if (block.innerBlocks && Array.isArray(block.innerBlocks)) {
          processedBlock.innerBlocks = processBlocksRecursively(block.innerBlocks);
        }
        return processedBlock;
      });
    };
    editorBlocks = processBlocksRecursively(editorBlocks);
    const backgroundColour = data.nodeByUri.backgroundColour?.backgroundColour ?? "white";
    const returnData = {
      uri,
      backgroundColour,
      editorBlocks,
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
