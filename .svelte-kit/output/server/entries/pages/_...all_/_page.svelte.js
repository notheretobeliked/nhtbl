import { c as create_ssr_component, e as escape, d as each, v as validate_component } from "../../../chunks/ssr.js";
import { B as BlockRenderer } from "../../../chunks/BlockRenderer.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let editorBlocks, backgroundColour, uri;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  {
    {
      ({ editorBlocks, backgroundColour, uri } = data);
      backgroundColour = backgroundColour ?? "white";
    }
  }
  return `<div class="${"py-24 min-h-screen bg-" + escape(backgroundColour, true)}">${each(editorBlocks, (block, index) => {
    return `${validate_component(BlockRenderer, "BlockRenderer").$$render($$result, { block }, {}, {})}`;
  })} </div>`;
});
export {
  Page as default
};
