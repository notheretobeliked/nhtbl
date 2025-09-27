import { c as create_ssr_component, a as add_attribute, e as escape } from "./ssr.js";
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { label = "Read more" } = $$props;
  let { url = "/" } = $$props;
  let { active = false } = $$props;
  let { font = "display" } = $$props;
  let { textClass = "text-base" } = $$props;
  let { colourClass = "bg-nhtbl-green-base" } = $$props;
  let { textColourClass = "text-black" } = $$props;
  if (active)
    colourClass = "bg-black text-nhtbl-green-base border-nhtbl-green-base";
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.font === void 0 && $$bindings.font && font !== void 0)
    $$bindings.font(font);
  if ($$props.textClass === void 0 && $$bindings.textClass && textClass !== void 0)
    $$bindings.textClass(textClass);
  if ($$props.colourClass === void 0 && $$bindings.colourClass && colourClass !== void 0)
    $$bindings.colourClass(colourClass);
  if ($$props.textColourClass === void 0 && $$bindings.textColourClass && textColourClass !== void 0)
    $$bindings.textColourClass(textColourClass);
  return `<a${add_attribute("href", url, 0)} class="${escape(colourClass, true) + " rounded-full transition-all duration-500 hover:bg-black hover:text-nhtbl-green-base hover:border-nhtbl-green-base pt-3 " + escape(font === "display" ? "pb-2" : "pb-3", true) + " px-4 border-black border " + escape(textClass, true) + " " + escape(textColourClass, true) + " font-" + escape(font, true) + " cursor-pointer"}" role="button">${escape(label)}</a>`;
});
export {
  Button as B
};
