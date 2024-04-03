import { c as create_ssr_component, e as escape, a as add_attribute, b as subscribe, d as each, v as validate_component } from "../../chunks/index3.js";
import { p as page } from "../../chunks/stores.js";
const app = "";
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { label = "Read more" } = $$props;
  let { url = "/" } = $$props;
  let { active = false } = $$props;
  let { variant = "primary" } = $$props;
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  return `<button class="${escape(
    active ? "bg-nhtbl-purple-base" : "bg-nhtbl-green-base hover:bg-nhtbl-purple-base",
    true
  ) + " rounded-full hover:bg-nhtbl-purple-base py-2 px-4 border-black border"}"><a${add_attribute("href", url, 0)}>${escape(label)}</a></button>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  const menuItems = data.data.menu.menuItems.nodes;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_page();
  return `<header><nav class="fixed z-30 w-full flex px-4 justify-between items-center"><a href="/"><img src="/Nhtbl-logo.png" width="89" height="89" alt="A happy face drawn by a child"></a>
    <ul class="flex flex-row gap-7 justify-end">${each(menuItems, (menuItem, index) => {
    return `${validate_component(Button, "Button").$$render(
      $$result,
      {
        active: $page.url.pathname === menuItem.uri,
        label: menuItem.label,
        url: menuItem.uri
      },
      {},
      {}
    )}`;
  })}</ul></nav></header>
${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
