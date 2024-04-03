import { c as create_ssr_component, v as validate_component } from "../../../chunks/index3.js";
import { M as Masonry, P as PortfolioItem } from "../../../chunks/Masonry.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let [minColWidth, maxColWidth, gap] = [400, 800, 30];
  let items = data.data.nhtblProjects.nodes;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
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
