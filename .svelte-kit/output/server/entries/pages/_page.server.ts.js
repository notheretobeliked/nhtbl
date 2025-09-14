import { P as PageContent } from "../../chunks/page.js";
import { u as urqlQuery } from "../../chunks/client.js";
import { e as error } from "../../chunks/index.js";
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
      if (block.attributes.style.elements && block.attributes.style.elements.link && block.attributes.style.elements.link.color && block.attributes.style.elements.link.color.text) {
        const colorValue = block.attributes.style.elements.link.color.text.split("|")[1];
        block.attributes.textColor = colorValue;
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
  const uri = `/`;
  try {
    const data = await urqlQuery(PageContent, { uri });
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
      error(httpError.status ?? 500, httpError.message);
    }
    error(500, err);
  }
};
export {
  load,
  prerender
};
