import { c as create_ssr_component, d as each, v as validate_component } from "../../chunks/ssr.js";
import { B as BlockRenderer } from "../../chunks/BlockRenderer.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let blocks = data.editorBlocks;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<main class="main w-full overflow-x-hidden">${each(blocks, (block, index) => {
    return `${validate_component(BlockRenderer, "BlockRenderer").$$render($$result, { block }, {}, {})}`;
  })} </main>`;
});
export {
  Page as default
};
