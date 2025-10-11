import { h as head, b as bind_props, a as pop, c as attr, p as push, f as fallback, e as escape_html, d as attr_class, g as clsx, i as stringify, j as store_get, k as ensure_array_like, u as unsubscribe_stores, l as slot } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import { p as page } from "../../chunks/stores.js";
function Twitter($$payload, $$props) {
  push();
  let imageUrl;
  let image = $$props["image"];
  let metadescription = $$props["metadescription"];
  let pageTitle = $$props["pageTitle"];
  let siteUrl = $$props["siteUrl"];
  function selectImageSize(sizes, preferredSize = "large") {
    return sizes.find((size) => size.name === preferredSize) || sizes[0];
  }
  imageUrl = image ? selectImageSize(image.mediaDetails.sizes ?? []).sourceUrl ?? void 0 : void 0;
  head($$payload, ($$payload2) => {
    $$payload2.out.push(`<meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title"${attr("content", pageTitle)}/> <meta name="twitter:description"${attr("content", metadescription)}/> <meta name="twitter:url"${attr("content", siteUrl)}/> `);
    if (image) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<meta name="twitter:image"${attr("content", imageUrl)}/> <meta name="twitter:image:alt"${attr("content", image.altText)}/>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]-->`);
  });
  bind_props($$props, { image, metadescription, pageTitle, siteUrl });
  pop();
}
function OpenGraph($$payload, $$props) {
  push();
  let imageUrl;
  let image = $$props["image"];
  let metadescription = $$props["metadescription"];
  let ogLanguage = fallback($$props["ogLanguage"], "en_UK");
  let pageTitle = $$props["pageTitle"];
  let siteTitle = fallback($$props["siteTitle"], "Not here to be liked");
  let siteUrl = $$props["siteUrl"];
  function selectImageSize(sizes, preferredSize = "large") {
    return sizes.find((size) => size.name === preferredSize) || sizes[0];
  }
  imageUrl = image ? selectImageSize(image.mediaDetails.sizes ?? []).sourceUrl ?? void 0 : void 0;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(pageTitle)}</title>`;
    $$payload2.out.push(`<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png"/> <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/> <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/> <link rel="manifest" href="/site.webmanifest"/> <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/> <meta name="msapplication-TileColor" content="#da532c"/> <meta name="theme-color" content="#ffffff"/> <meta name="description"${attr("content", metadescription)}/> <meta property="og:site_name"${attr("content", siteTitle)}/> <meta property="og:locale"${attr("content", ogLanguage)}/> <meta property="og:url"${attr("content", siteUrl)}/> <meta property="og:type" content="website"/> <meta property="og:title"${attr("content", pageTitle)}/> <meta property="og:description"${attr("content", metadescription)}/> `);
    if (imageUrl) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<meta property="og:image"${attr("content", imageUrl)}/> <meta property="og:image:alt"${attr("content", image?.altText ?? "")}/>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]-->`);
  });
  bind_props($$props, {
    image,
    metadescription,
    ogLanguage,
    pageTitle,
    siteTitle,
    siteUrl
  });
  pop();
}
function Button($$payload, $$props) {
  push();
  let {
    label = "Read more",
    url = "/",
    active = false,
    textClass = "text-sm uppercase text-center",
    fullWidth = false,
    colourClass = "bg-black",
    textColourClass = "text-yellow",
    shrink = false,
    // Default to false to maintain backward compatibility
    selfAlign = "",
    // Default to empty string
    disabled = false,
    type = "button"
  } = $$props;
  const baseClasses = `${colourClass} uppercase font-semibold text-center rounded-lg border-black transition-all duration-500 hover:bg-yellow hover:text-black hover:border-black py-2 px-4 border ${textClass} ${textColourClass} cursor-pointer ${fullWidth ? "w-full block text-center" : "inline-block w-fit"} ${shrink ? "flex-shrink-0 flex-grow-0" : ""} ${selfAlign}`;
  if (type === "submit") {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button${attr("type", type)}${attr("disabled", disabled, true)}${attr_class(clsx(baseClasses))}>${escape_html(label)}</button>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (type === "button") {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<a${attr("href", url)}${attr_class(clsx(baseClasses))} role="button">${escape_html(label)}</a>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (type === "nav") {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<a${attr("href", url)}${attr_class(`font-sans text-xl lg:text-lg ${stringify(active ? "border-nhtbl-green-base" : "border-b-transparent hover:border-b-nhtbl-purple-base")} border-b-4 pb-1`)} role="button">${escape_html(label)}</a>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
function Header($$payload, $$props) {
  push();
  var $$store_subs;
  let { menuItems: rawMenuItems } = $$props;
  let open = false;
  const currentPagePath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
  store_get($$store_subs ??= {}, "$page", page).data?.breadcrumbs || [];
  const menuItems = rawMenuItems.map((item) => ({
    ...item,
    // Check if current path matches exactly OR starts with the menu item path (for nested pages)
    current: currentPagePath === item.uri || item.uri !== "/" && currentPagePath.startsWith(item.uri)
  }));
  const each_array = ensure_array_like(menuItems);
  $$payload.out.push(`<header><nav class="h-12 fixed inset-x-2 md:inset-x-4 top-4 bg-white/60 rounded-full backdrop-blur-md z-30 flex justify-between items-center px-1 ml-1">`);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="initial" style="transform-origin: left center;"><a href="/" class="z-30 block mt-1 ml-1 font-display text-lg whitespace-nowrap">Not here to be liked</a></div>`);
  }
  $$payload.out.push(`<!--]--> <div class="block md:hidden z-50 hamburger">`);
  if (!open) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.03 10.1801C9.68 10.3801 16.34 10.6201 22.99 10.6301C29.64 10.6401 36.29 10.4201 42.93 10.2301C44.86 10.1801 44.86 7.17006 42.93 7.23006C36.29 7.42006 29.65 7.65006 23 7.63006C16.34 7.62006 9.68999 7.38006 3.03 7.18006C1.1 7.13006 1.11 10.1301 3.03 10.1801Z" fill="#010101"></path><path d="M3.03 24.1801C9.68 24.3801 16.34 24.6201 22.99 24.6301C29.64 24.6401 36.29 24.4201 42.93 24.2301C44.86 24.1801 44.86 21.1701 42.93 21.2301C36.29 21.4201 29.64 21.6401 22.99 21.6301C16.33 21.6201 9.68 21.3801 3.03 21.1801C1.1 21.1301 1.11 24.1301 3.03 24.1801Z" fill="#010101"></path><path d="M3.03 38.1801C9.68 38.3801 16.34 38.6201 22.99 38.6301C29.64 38.6401 36.29 38.4201 42.93 38.2301C44.86 38.1801 44.86 35.1701 42.93 35.2301C36.29 35.4201 29.64 35.6401 22.99 35.6301C16.33 35.6201 9.68 35.3801 3.03 35.1801C1.1 35.1301 1.11 38.1301 3.03 38.1801Z" fill="#010101"></path></svg>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1583_784)"><path d="M2.94999 44.6399C16.65 31.0399 29.95 17.0399 42.83 2.65995C44.11 1.22995 42 -0.900052 40.71 0.539948C27.83 14.9199 14.53 28.9199 0.829994 42.5199C-0.540006 43.8799 1.57999 45.9999 2.94999 44.6399Z" fill="#010101"></path><path d="M1.77999 3.71003C15.38 17.41 29.38 30.71 43.76 43.59C45.19 44.87 47.32 42.76 45.88 41.47C31.5 28.59 17.5 15.29 3.89999 1.59003C2.53999 0.220034 0.419987 2.34003 1.77999 3.71003Z" fill="#010101"></path></g><defs><clipPath id="clip0_1583_784"><rect width="47.3" height="45.27" fill="white"></rect></clipPath></defs></svg>`);
  }
  $$payload.out.push(`<!--]--></div> <ul role="navigation" aria-label="Main"${attr_class(`fixed w-full items-center md:static md:content-center md:flex-wrap h-screen md:h-0 md:px-4 -top-3 left-0 z-30 bg-white/95 md:bg-transparent backdrop-blur-md justify-center md:flex flex-row gap-6 md:justify-end ${stringify(open ? "flex flex-col" : "hidden")}`)}><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let menuItem = each_array[$$index];
    $$payload.out.push(`<li>`);
    Button($$payload, {
      type: "nav",
      active: menuItem.current,
      label: menuItem.label,
      url: menuItem.uri,
      font: "sans",
      onclick: () => open = false
    });
    $$payload.out.push(`<!----></li>`);
  }
  $$payload.out.push(`<!--]--></ul></nav></header>`);
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  pop();
}
function _layout($$payload, $$props) {
  push();
  let data = $$props["data"];
  let { seo, menu, uri } = data;
  const menuItems = menu.menuItems.nodes;
  const image = seo.opengraphImage;
  const metadescription = seo.metaDesc;
  const pageTitle = seo.title;
  const siteUrl = seo.siteUrl;
  const siteTitle = seo.opengraphSiteName;
  $$payload.out.push(`<!---->`);
  {
    OpenGraph($$payload, { image, metadescription, pageTitle, siteTitle, siteUrl });
    $$payload.out.push(`<!----> `);
    Twitter($$payload, { image, metadescription, pageTitle, siteUrl });
    $$payload.out.push(`<!---->`);
  }
  $$payload.out.push(`<!----> <!---->`);
  {
    Header($$payload, { menuItems });
  }
  $$payload.out.push(`<!----> <!---->`);
  slot($$payload, $$props, "default", {}, null);
  $$payload.out.push(`<!---->`);
  bind_props($$props, { data });
  pop();
}
export {
  _layout as default
};
