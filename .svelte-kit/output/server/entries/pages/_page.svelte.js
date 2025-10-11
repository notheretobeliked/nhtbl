import { k as ensure_array_like, b as bind_props } from "../../chunks/index2.js";
import { B as BlockRenderer } from "../../chunks/BlockRenderer.js";
function _page($$payload, $$props) {
  let data = $$props["data"];
  let editorBlocks, backgroundColour, uri;
  {
    ({ editorBlocks, backgroundColour, uri } = data);
    backgroundColour = backgroundColour ?? "white";
  }
  const each_array = ensure_array_like(editorBlocks);
  $$payload.out.push(`<div class="main w-full overflow-x-hidden"><!--[-->`);
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
