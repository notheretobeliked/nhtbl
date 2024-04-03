import { c as create_ssr_component, e as escape, a as add_attribute, v as validate_component, d as each } from "./index3.js";
const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { imageObject } = $$props;
  let { imageSize = "medium" } = $$props;
  let { fit = "none" } = $$props;
  const findImageSizeData = (property, sizes, name) => sizes.find((size) => size.name === name)?.[property] || "";
  const getSrcSet = (sizes) => {
    return sizes.map(({ sourceUrl, width: width2 }) => `${sourceUrl} ${width2}w`).join(", ");
  };
  const src = findImageSizeData("sourceUrl", imageObject.mediaDetails.sizes, imageSize);
  const width = findImageSizeData("width", imageObject.mediaDetails.sizes, imageSize);
  const height = findImageSizeData("height", imageObject.mediaDetails.sizes, imageSize);
  if ($$props.imageObject === void 0 && $$bindings.imageObject && imageObject !== void 0)
    $$bindings.imageObject(imageObject);
  if ($$props.imageSize === void 0 && $$bindings.imageSize && imageSize !== void 0)
    $$bindings.imageSize(imageSize);
  if ($$props.fit === void 0 && $$bindings.fit && fit !== void 0)
    $$bindings.fit(fit);
  return `<img class="${"w-full h-full object-" + escape(fit, true)}"${add_attribute("src", src, 0)}${add_attribute("alt", imageObject.altText, 0)}${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("srcset", getSrcSet(imageObject.mediaDetails.sizes), 0)} sizes="(max-width: 600px) 480px, 800px">`;
});
const PortfolioItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `${block?.featuredImage?.node?.mediaDetails?.sizes ? `<div style="cursor: pointer;">${validate_component(Image, "Image").$$render(
    $$result,
    {
      imageSize: "medium_large",
      imageObject: block.featuredImage.node
    },
    {},
    {}
  )}</div>` : ``}

${``}`;
});
const Masonry_svelte_svelte_type_style_lang = "";
const css = {
  code: ".svelte-b2jtby:where(div.masonry){display:flex;justify-content:center;overflow-wrap:anywhere;box-sizing:border-box}.svelte-b2jtby:where(div.masonry div.col){display:grid;height:max-content;width:100%}",
  map: null
};
const Masonry = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let nCols;
  let itemsToCols;
  let { animate = true } = $$props;
  let { columnClass = `` } = $$props;
  let { duration = 200 } = $$props;
  let { gap = 20 } = $$props;
  let { getId = (item) => {
    if (typeof item === `number`)
      return item;
    if (typeof item === `string`)
      return item;
    return item[idKey];
  } } = $$props;
  let { idKey = `id` } = $$props;
  let { items } = $$props;
  let { masonryHeight = 0 } = $$props;
  let { masonryWidth = 0 } = $$props;
  let { maxColWidth = 500 } = $$props;
  let { minColWidth = 330 } = $$props;
  let { style = `` } = $$props;
  let { class: className = `` } = $$props;
  if ($$props.animate === void 0 && $$bindings.animate && animate !== void 0)
    $$bindings.animate(animate);
  if ($$props.columnClass === void 0 && $$bindings.columnClass && columnClass !== void 0)
    $$bindings.columnClass(columnClass);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.gap === void 0 && $$bindings.gap && gap !== void 0)
    $$bindings.gap(gap);
  if ($$props.getId === void 0 && $$bindings.getId && getId !== void 0)
    $$bindings.getId(getId);
  if ($$props.idKey === void 0 && $$bindings.idKey && idKey !== void 0)
    $$bindings.idKey(idKey);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.masonryHeight === void 0 && $$bindings.masonryHeight && masonryHeight !== void 0)
    $$bindings.masonryHeight(masonryHeight);
  if ($$props.masonryWidth === void 0 && $$bindings.masonryWidth && masonryWidth !== void 0)
    $$bindings.masonryWidth(masonryWidth);
  if ($$props.maxColWidth === void 0 && $$bindings.maxColWidth && maxColWidth !== void 0)
    $$bindings.maxColWidth(maxColWidth);
  if ($$props.minColWidth === void 0 && $$bindings.minColWidth && minColWidth !== void 0)
    $$bindings.minColWidth(minColWidth);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  $$result.css.add(css);
  nCols = Math.min(items.length, Math.floor(masonryWidth / (minColWidth + gap)) || 1);
  itemsToCols = items.reduce(
    (cols, item, idx) => {
      cols[idx % cols.length].push([item, idx]);
      return cols;
    },
    Array(nCols).fill(null).map(() => [])
  );
  return `<div class="${"masonry " + escape(className, true) + " svelte-b2jtby"}" style="${"gap: " + escape(gap, true) + "px; " + escape(style, true)}">${each(itemsToCols, (col) => {
    return `<div class="${"col " + escape(columnClass, true) + " svelte-b2jtby"}" style="${"gap: " + escape(gap, true) + "px; max-width: " + escape(maxColWidth, true) + "px;"}">${animate ? `${each(col, ([item, idx]) => {
      return `<div class="svelte-b2jtby">${slots.default ? slots.default({ idx, item }) : `
              <span class="svelte-b2jtby">${escape(item)}</span>
            `}
          </div>`;
    })}` : `${each(col, ([item, idx]) => {
      return `${slots.default ? slots.default({ idx, item }) : `
            <span class="svelte-b2jtby">${escape(item)}</span>
          `}`;
    })}`}
    </div>`;
  })}</div>`;
});
export {
  Image as I,
  Masonry as M,
  PortfolioItem as P
};
