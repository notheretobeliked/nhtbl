import { c as create_ssr_component, b as subscribe, v as validate_component } from "../../../chunks/ssr.js";
import { p as page } from "../../../chunks/stores.js";
import { M as Masonry, P as PortfolioItem } from "../../../chunks/Masonry.js";
let maxColWidth = 1200;
let gap = 30;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  let items = data.data.nhtblProjects.nodes;
  let minColWidth = 140;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $page.url.pathname;
  {
    {
      if (typeof window !== "undefined") {
        minColWidth = window.innerWidth >= 768 ? 420 : 140;
      }
    }
  }
  $$unsubscribe_page();
  return `<div class="bg-black">${validate_component(Masonry, "Masonry").$$render(
    $$result,
    {
      items,
      minColWidth,
      maxColWidth,
      gap,
      idKey: "slug",
      animate: true
    },
    {},
    {
      default: ({ item }) => {
        return `${validate_component(PortfolioItem, "PortfolioItem").$$render($$result, { block: item }, {}, {})}`;
      }
    }
  )}</div>`;
});
export {
  Page as default
};
