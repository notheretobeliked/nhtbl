import { c as create_ssr_component, b as subscribe, d as each, v as validate_component } from "../../../../chunks/ssr.js";
import "../../../../chunks/client2.js";
import { p as page } from "../../../../chunks/stores.js";
import { M as Modal, P as PortfolioItemDetails } from "../../../../chunks/Masonry.svelte_svelte_type_style_lang.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentPagePath;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  let items = data.data.nhtblProjects.nodes;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  currentPagePath = $page.url.pathname;
  $$unsubscribe_page();
  return `<div class="bg-black">${each(items, (block) => {
    return `${block.uri === currentPagePath ? `${validate_component(Modal, "Modal").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(PortfolioItemDetails, "PortfolioItemDetails").$$render($$result, { block }, {}, {})} `;
      }
    })}` : ``}`;
  })}</div>`;
});
export {
  Page as default
};
