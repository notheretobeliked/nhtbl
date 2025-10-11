import { k as ensure_array_like, h as head, e as escape_html, o as attr_style, c as attr, a as pop, p as push, i as stringify } from "../../../../chunks/index2.js";
import { h as html, B as BlockRenderer } from "../../../../chunks/BlockRenderer.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  const excerpt = data.excerpt;
  const clients = data.clients;
  const services = data.services;
  const yearDisplay = data.yearDisplay;
  const editorBlocks = data.editorBlocks;
  data.backgroundColour ?? "black";
  data.uri;
  data.portfolioData;
  data.pageType;
  const title = data.title;
  data.seo;
  const each_array_2 = ensure_array_like(editorBlocks);
  head($$payload, ($$payload2) => {
  });
  $$payload.out.push(`<div class="portfolio-page py-24 min-h-screen bg-black !text-white px-2"><h1 class="font-display text-xl lg:text-2xl alignwide my-4">${escape_html(title)}</h1> <div class="grid lg:grid-cols-[2fr_1fr] alignwide gap-7 mb-7"><div class="text-lg lg:text-xl">${html(excerpt)}</div> <div class="flex flex-col gap-2">`);
  if (clients) {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(clients);
    $$payload.out.push(`<p class="text-sm lg:text-base text-gray-600">With/for: <!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let client = each_array[$$index];
      $$payload.out.push(`<!---->${escape_html(client)}`);
    }
    $$payload.out.push(`<!--]--> ${escape_html(yearDisplay ? ` ${yearDisplay}` : "")}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (services.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array_1 = ensure_array_like(services);
    $$payload.out.push(`<div class="services flex flex-row gap-2 mt-4 flex-wrap"><!--[-->`);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let service = each_array_1[$$index_1];
      $$payload.out.push(`<div class="group-hover:border-black font-sans text-sm rounded-full border border-white px-2 py-0 whitespace-nowrap">${escape_html(service)}</div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div> <div class="portfolio-content alignfull svelte-15ehqgt"><!--[-->`);
  for (let index = 0, $$length = each_array_2.length; index < $$length; index++) {
    let block = each_array_2[index];
    $$payload.out.push(`<div class="portfolio-section w-screen h-screen svelte-15ehqgt"${attr_style(`z-index: ${stringify(index + 1)};`)}${attr("data-section-index", index)}>`);
    BlockRenderer($$payload, { block });
    $$payload.out.push(`<!----></div>`);
  }
  $$payload.out.push(`<!--]--></div></div>`);
  pop();
}
export {
  _page as default
};
