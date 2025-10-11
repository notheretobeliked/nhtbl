import { k as ensure_array_like, d as attr_class, b as bind_props, i as stringify } from "../../../chunks/index2.js";
import { B as BlockRenderer } from "../../../chunks/BlockRenderer.js";
function _page($$payload, $$props) {
  let data = $$props["data"];
  let editorBlocks, backgroundColour, uri;
  console.log(data);
  {
    ({ editorBlocks, backgroundColour, uri } = data);
    backgroundColour = backgroundColour ?? "white";
  }
  const each_array = ensure_array_like(editorBlocks);
  $$payload.out.push(`<div${attr_class(`py-40 min-h-screen bg-${stringify(backgroundColour)}`)}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let block = each_array[index];
    BlockRenderer($$payload, { block });
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, { data });
}
export {
  _page as default
};
