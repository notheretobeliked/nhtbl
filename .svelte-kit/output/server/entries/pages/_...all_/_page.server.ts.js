import { P as PageContent } from "../../../chunks/page.js";
import { g as graphqlQuery, c as checkResponse } from "../../../chunks/graphql.js";
import { e as error } from "../../../chunks/index.js";
const prerender = true;
function normalizeEditorBlock(block) {
  if (!block.attributes) {
    block.attributes = {};
  }
  if (block.name.startsWith("acf/")) {
    if ("alignment" in block.attributes) {
      block.attributes.align = block.attributes.align || block.attributes.alignment;
      delete block.attributes.alignment;
    }
  }
  if (typeof block.attributes.style === "string") {
    try {
      block.attributes.style = JSON.parse(block.attributes.style.replace(/var:preset\|/g, ""));
    } catch (error2) {
      console.error("Error parsing style attribute:", error2);
      block.attributes.style = null;
    }
  }
  if (block.children) {
    block.children = block.children.map(normalizeEditorBlock);
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
  const uri = `/${params.all || ""}`;
  try {
    const response = await graphqlQuery(PageContent, { uri });
    checkResponse(response);
    const { data } = await response.json();
    if (data.page === null) {
      error(404, {
        message: "Not found"
      });
    }
    let editorBlocks = data.page.editorBlocks ? flatListToHierarchical(data.page.editorBlocks) : [];
    return {
      data,
      uri,
      editorBlocks
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
