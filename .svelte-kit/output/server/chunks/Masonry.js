import { c as create_ssr_component, a as add_attribute, v as validate_component, e as escape, d as each } from './ssr.js'
import { M as Modal, P as PortfolioItemDetails } from './Masonry.svelte_svelte_type_style_lang.js'
const findImageSizeData = (property, sizes, name) => {
  const size = sizes.find(size2 => size2.name === name)
  if (size && property in size) {
    return String(size[property])
  }
  return ''
}
const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { imageObject } = $$props
  console.log(imageObject)
  let { lazy = true } = $$props
  let { imageSize } = $$props
  let { fit = 'none' } = $$props
  let { extraClasses = '' } = $$props
  const src = findImageSizeData('sourceUrl', imageObject.mediaDetails.sizes, imageSize)
  const width = findImageSizeData('width', imageObject.mediaDetails.sizes, imageSize)
  const height = findImageSizeData('height', imageObject.mediaDetails.sizes, imageSize)
  if ($$props.imageObject === void 0 && $$bindings.imageObject && imageObject !== void 0) $$bindings.imageObject(imageObject)
  if ($$props.lazy === void 0 && $$bindings.lazy && lazy !== void 0) $$bindings.lazy(lazy)
  if ($$props.imageSize === void 0 && $$bindings.imageSize && imageSize !== void 0) $$bindings.imageSize(imageSize)
  if ($$props.fit === void 0 && $$bindings.fit && fit !== void 0) $$bindings.fit(fit)
  if ($$props.extraClasses === void 0 && $$bindings.extraClasses && extraClasses !== void 0) $$bindings.extraClasses(extraClasses)
  return `<img${add_attribute('loading', lazy ? 'lazy' : 'eager', 0)}${add_attribute('class', `w-full h-full object-${fit} ${extraClasses}`, 0)}${add_attribute(
    'src',
    src,
    0,
  )}${add_attribute('alt', imageObject.altText, 0)}${add_attribute('width', width, 0)}${add_attribute('height', height, 0)}>`
})
const PortfolioItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  let { isActive = false } = $$props
  let { noLink = false } = $$props
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  if ($$props.isActive === void 0 && $$bindings.isActive && isActive !== void 0) $$bindings.isActive(isActive)
  if ($$props.noLink === void 0 && $$bindings.noLink && noLink !== void 0) $$bindings.noLink(noLink)
  return `${
    block?.featuredImage?.node?.mediaDetails?.sizes
      ? `<a${add_attribute('href', block.uri, 0)}><div class="cursor-pointer relative">${validate_component(Image, 'Image').$$render(
          $$result,
          {
            imageSize: 'medium',
            imageObject: block.featuredImage.node,
            fit: 'contain',
          },
          {},
          {},
        )} ${``}</div></a>`
      : ``
  } ${
    isActive
      ? `${validate_component(Modal, 'Modal').$$render(
          $$result,
          {},
          {},
          {
            default: () => {
              return `${validate_component(PortfolioItemDetails, 'PortfolioItemDetails').$$render($$result, { block }, {}, {})}`
            },
          },
        )}`
      : ``
  }`
})
const css = {
  code: '.svelte-1jlnrye:where(div.masonry){display:flex;justify-content:center;overflow-wrap:anywhere;box-sizing:border-box}.svelte-1jlnrye:where(div.masonry div.col){display:grid;height:-moz-max-content;height:max-content;width:100%}',
  map: null,
}
const Masonry = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let nCols
  let itemsToCols
  let { animate = true } = $$props
  let { columnClass = `` } = $$props
  let { duration = 200 } = $$props
  let { gap = 20 } = $$props
  let {
    getId = item => {
      if (typeof item === `number`) return item
      if (typeof item === `string`) return item
      return item[idKey]
    },
  } = $$props
  let { idKey = `id` } = $$props
  let { items } = $$props
  let { masonryHeight = 0 } = $$props
  let { masonryWidth = 0 } = $$props
  let { maxColWidth = 500 } = $$props
  let { minColWidth = 330 } = $$props
  let { style = `` } = $$props
  let { class: className = `` } = $$props
  if ($$props.animate === void 0 && $$bindings.animate && animate !== void 0) $$bindings.animate(animate)
  if ($$props.columnClass === void 0 && $$bindings.columnClass && columnClass !== void 0) $$bindings.columnClass(columnClass)
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0) $$bindings.duration(duration)
  if ($$props.gap === void 0 && $$bindings.gap && gap !== void 0) $$bindings.gap(gap)
  if ($$props.getId === void 0 && $$bindings.getId && getId !== void 0) $$bindings.getId(getId)
  if ($$props.idKey === void 0 && $$bindings.idKey && idKey !== void 0) $$bindings.idKey(idKey)
  if ($$props.items === void 0 && $$bindings.items && items !== void 0) $$bindings.items(items)
  if ($$props.masonryHeight === void 0 && $$bindings.masonryHeight && masonryHeight !== void 0) $$bindings.masonryHeight(masonryHeight)
  if ($$props.masonryWidth === void 0 && $$bindings.masonryWidth && masonryWidth !== void 0) $$bindings.masonryWidth(masonryWidth)
  if ($$props.maxColWidth === void 0 && $$bindings.maxColWidth && maxColWidth !== void 0) $$bindings.maxColWidth(maxColWidth)
  if ($$props.minColWidth === void 0 && $$bindings.minColWidth && minColWidth !== void 0) $$bindings.minColWidth(minColWidth)
  if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style)
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className)
  $$result.css.add(css)
  nCols = Math.min(items.length, Math.floor(masonryWidth / (minColWidth + gap)) || 1)
  itemsToCols = items.reduce(
    (cols, item, idx) => {
      cols[idx % cols.length].push([item, idx])
      return cols
    },
    Array(nCols).fill(null).map(() => []),
    // prettier-ignore
  )
  return `<div class="${'masonry ' + escape(className, true) + ' svelte-1jlnrye'}" style="${'gap: ' + escape(gap, true) + 'px; ' + escape(style, true)}">${each(
    itemsToCols,
    col => {
      return `<div class="${'col ' + escape(columnClass, true) + ' svelte-1jlnrye'}" style="${
        'gap: ' + escape(gap, true) + 'px; max-width: ' + escape(maxColWidth, true) + 'px;'
      }">${
        animate
          ? `${each(col, ([item, idx]) => {
              return `<div class="svelte-1jlnrye">${slots.default ? slots.default({ idx, item }) : ` <span class="svelte-1jlnrye">${escape(item)}</span> `} </div>`
            })}`
          : `${each(col, ([item, idx]) => {
              return `${slots.default ? slots.default({ idx, item }) : ` <span class="svelte-1jlnrye">${escape(item)}</span> `}`
            })}`
      } </div>`
    },
  )}</div>`
})
export { Image as I, Masonry as M, PortfolioItem as P }
