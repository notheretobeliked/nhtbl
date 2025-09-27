import { c as create_ssr_component, a as add_attribute, e as escape, b as subscribe, d as each, v as validate_component } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import { B as Button } from "../../chunks/Button.js";
function selectImageSize$1(sizes, preferredSize = "large") {
  return sizes.find((size) => size.name === preferredSize) || sizes[0];
}
const Twitter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let imageUrl;
  let { image } = $$props;
  let { metadescription } = $$props;
  let { pageTitle } = $$props;
  let { siteUrl } = $$props;
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.metadescription === void 0 && $$bindings.metadescription && metadescription !== void 0)
    $$bindings.metadescription(metadescription);
  if ($$props.pageTitle === void 0 && $$bindings.pageTitle && pageTitle !== void 0)
    $$bindings.pageTitle(pageTitle);
  if ($$props.siteUrl === void 0 && $$bindings.siteUrl && siteUrl !== void 0)
    $$bindings.siteUrl(siteUrl);
  imageUrl = image ? selectImageSize$1(image.mediaDetails.sizes ?? []).sourceUrl ?? void 0 : void 0;
  return `${$$result.head += `<!-- HEAD_svelte-17zaiba_START --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${add_attribute("content", pageTitle, 0)}><meta name="twitter:description"${add_attribute("content", metadescription, 0)}><meta name="twitter:url"${add_attribute("content", siteUrl, 0)}>${image ? `<meta name="twitter:image"${add_attribute("content", imageUrl, 0)}> <meta name="twitter:image:alt"${add_attribute("content", image.altText, 0)}>` : ``}<!-- HEAD_svelte-17zaiba_END -->`, ""}`;
});
function selectImageSize(sizes, preferredSize = "large") {
  return sizes.find((size) => size.name === preferredSize) || sizes[0];
}
const OpenGraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let imageUrl;
  let { image } = $$props;
  let { metadescription } = $$props;
  let { ogLanguage = "en_UK" } = $$props;
  let { pageTitle } = $$props;
  let { siteTitle = "Not here to be liked" } = $$props;
  let { siteUrl } = $$props;
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.metadescription === void 0 && $$bindings.metadescription && metadescription !== void 0)
    $$bindings.metadescription(metadescription);
  if ($$props.ogLanguage === void 0 && $$bindings.ogLanguage && ogLanguage !== void 0)
    $$bindings.ogLanguage(ogLanguage);
  if ($$props.pageTitle === void 0 && $$bindings.pageTitle && pageTitle !== void 0)
    $$bindings.pageTitle(pageTitle);
  if ($$props.siteTitle === void 0 && $$bindings.siteTitle && siteTitle !== void 0)
    $$bindings.siteTitle(siteTitle);
  if ($$props.siteUrl === void 0 && $$bindings.siteUrl && siteUrl !== void 0)
    $$bindings.siteUrl(siteUrl);
  imageUrl = image ? selectImageSize(image.mediaDetails.sizes ?? []).sourceUrl ?? void 0 : void 0;
  return `${$$result.head += `<!-- HEAD_svelte-bdmtnk_START -->${$$result.title = `<title>${escape(pageTitle)}</title>`, ""}<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="manifest" href="/site.webmanifest"><link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"><meta name="msapplication-TileColor" content="#da532c"><meta name="theme-color" content="#ffffff"><meta name="description"${add_attribute("content", metadescription, 0)}><meta property="og:site_name"${add_attribute("content", siteTitle, 0)}><meta property="og:locale"${add_attribute("content", ogLanguage, 0)}><meta property="og:url"${add_attribute("content", siteUrl, 0)}><meta property="og:type" content="website"><meta property="og:title"${add_attribute("content", pageTitle, 0)}><meta property="og:description"${add_attribute("content", metadescription, 0)}>${imageUrl ? `<meta property="og:image"${add_attribute("content", imageUrl, 0)}> <meta property="og:image:alt"${add_attribute("content", image?.altText ?? "", 0)}>` : ``}<!-- HEAD_svelte-bdmtnk_END -->`, ""}`;
});
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentPagePath;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { menuItems } = $$props;
  if ($$props.menuItems === void 0 && $$bindings.menuItems && menuItems !== void 0)
    $$bindings.menuItems(menuItems);
  currentPagePath = $page.url.pathname;
  menuItems = menuItems.map((item) => ({
    ...item,
    // Update 'active' or any other relevant property based on the current path
    current: currentPagePath === item.uri
  }));
  $$unsubscribe_page();
  return `<header><nav class="fixed z-30 w-full flex px-4 pt-4 justify-between items-center h-12 md:h-24"><a href="/" class="z-30" data-svelte-h="svelte-n20nc6"><img src="/Nhtbl-logo.webp" class="z-50 h-12 w-12 md:h-20 md:w-20" width="89" height="89" alt="A happy face drawn by a child"></a> <div class="block md:hidden z-50 hamburger">${`<svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.03 10.1801C9.68 10.3801 16.34 10.6201 22.99 10.6301C29.64 10.6401 36.29 10.4201 42.93 10.2301C44.86 10.1801 44.86 7.17006 42.93 7.23006C36.29 7.42006 29.65 7.65006 23 7.63006C16.34 7.62006 9.68999 7.38006 3.03 7.18006C1.1 7.13006 1.11 10.1301 3.03 10.1801Z" fill="#010101"></path><path d="M3.03 24.1801C9.68 24.3801 16.34 24.6201 22.99 24.6301C29.64 24.6401 36.29 24.4201 42.93 24.2301C44.86 24.1801 44.86 21.1701 42.93 21.2301C36.29 21.4201 29.64 21.6401 22.99 21.6301C16.33 21.6201 9.68 21.3801 3.03 21.1801C1.1 21.1301 1.11 24.1301 3.03 24.1801Z" fill="#010101"></path><path d="M3.03 38.1801C9.68 38.3801 16.34 38.6201 22.99 38.6301C29.64 38.6401 36.29 38.4201 42.93 38.2301C44.86 38.1801 44.86 35.1701 42.93 35.2301C36.29 35.4201 29.64 35.6401 22.99 35.6301C16.33 35.6201 9.68 35.3801 3.03 35.1801C1.1 35.1301 1.11 38.1301 3.03 38.1801Z" fill="#010101"></path></svg>`}</div> <ul role="navigation" aria-label="Main" class="${"fixed w-full items-center md:static md:content-center md:flex-wrap h-screen md:h-24 inset-0 z-10 bg-nhtbl-green-base md:bg-transparent justify-center md:flex flex-row gap-6 md:justify-end " + escape("hidden", true)}">${each(menuItems, (menuItem) => {
    return `<li>${validate_component(Button, "Button").$$render(
      $$result,
      {
        active: menuItem.current,
        label: menuItem.label,
        url: menuItem.uri,
        font: "sans"
      },
      {},
      {}
    )} </li>`;
  })}</ul></nav></header>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { data } = $$props;
  let { seo, menu, uri } = data;
  const menuItems = menu.menuItems.nodes;
  const image = seo.opengraphImage;
  const metadescription = seo.metaDesc;
  const pageTitle = seo.title;
  const siteUrl = seo.siteUrl;
  const siteTitle = seo.opengraphSiteName;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_page();
  return `${validate_component(OpenGraph, "OpenGraph").$$render(
    $$result,
    {
      image,
      metadescription,
      pageTitle,
      siteTitle,
      siteUrl
    },
    {},
    {}
  )} ${validate_component(Twitter, "Twitter").$$render(
    $$result,
    {
      image,
      metadescription,
      pageTitle,
      siteUrl
    },
    {},
    {}
  )} ${validate_component(Header, "Header").$$render($$result, { menuItems }, {}, {})} ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
