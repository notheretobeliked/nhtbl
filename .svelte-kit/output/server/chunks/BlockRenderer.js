import { c as create_ssr_component, e as escape, a as add_attribute, d as each, v as validate_component, b as subscribe, o as onDestroy } from './ssr.js'
import { B as Button } from './Button.js'
import { I as Image, M as Masonry, P as PortfolioItem } from './Masonry.js'
import { w as writable } from './index2.js'
Promise.resolve()
const Emphas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { version = 'bubble' } = $$props
  let { content = '' } = $$props
  let { stroke = 'black' } = $$props
  if (stroke === null) stroke = 'black'
  if ($$props.version === void 0 && $$bindings.version && version !== void 0) $$bindings.version(version)
  if ($$props.content === void 0 && $$bindings.content && content !== void 0) $$bindings.content(content)
  if ($$props.stroke === void 0 && $$bindings.stroke && stroke !== void 0) $$bindings.stroke(stroke)
  return `${
    version === 'bubble'
      ? `<span class="relative inline-block">${escape(
          content,
        )} <div class="absolute -inset-10"><svg width="421" height="169" viewBox="-10 -10 441 189" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" preserveAspectRatio="none">${``}</svg></div></span>`
      : ``
  } ${
    version === 'line'
      ? `<span class="relative inline-block"><strong>${escape(
          content,
        )}</strong> <div class="absolute left-0 right-0 -bottom-1"><svg width="373" height="9" viewBox="0 0 373 9" fill="none" class="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${``}</svg></div></span>`
      : ``
  }`
})
const CoreParagraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const { content, fontSize, textColor, align } = block.attributes
  let segments = []
  const classNames = (fontSize2, textColor2, align2) => {
    let textClasses,
      alignClasses,
      colorClasses = ''
    switch (fontSize2) {
      case 'base':
        textClasses = 'text-sans text-sm md:text-base'
        break
      case 'lg':
        textClasses = 'font-display text-base md:text-lg'
        break
      case 'xl':
        textClasses = 'font-display text-lg md:text-xl'
        break
      case '2xl':
        textClasses = 'font-display text-xl md:text-2xl'
        break
      case null:
        textClasses = 'text-sans text-sm md:text-base'
        break
    }
    switch (align2) {
      case 'center':
        alignClasses = 'text-center'
        break
      case 'left':
        alignClasses = 'text-left'
        break
      case 'right':
        alignClasses = 'text-right'
        break
      case null:
        alignClasses = 'text-left'
        break
    }
    colorClasses = `text-${textColor2}`
    if (textColor2 === 'nhtbl-green-base') colorClasses = `${colorClasses} group-hover:text-black transition-color`
    return `${textClasses} ${alignClasses} ${colorClasses}`
  }
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return ` <p${add_attribute('class', classNames(fontSize, textColor, align), 0)}>${each(segments, ({ type, content: content2, version, key }) => {
    return `${
      type === 'svg'
        ? `${validate_component(Emphas, 'Emphas').$$render(
            $$result,
            {
              content: content2,
              version,
              stroke: textColor || 'black',
            },
            {},
            {},
          )}`
        : `<!-- HTML_TAG_START -->${content2}<!-- HTML_TAG_END --> `
    }`
  })}</p>`
})
const CoreHeading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const { content, fontSize, textColor, textAlign, level } = block.attributes
  let segments = []
  let hasSvg = false
  const classNames = (fontSize2, textColor2, textAlign2) => {
    let textClasses,
      alignClasses,
      colorClasses = ''
    switch (fontSize2) {
      case 'base':
        textClasses = 'text-sm md:text-base'
        break
      case 'lg':
        textClasses = 'text-base md:text-lg'
        break
      case 'xl':
        textClasses = 'text-lg md:text-xl'
        break
      case '2xl':
        textClasses = 'text-xl md:text-2xl'
        break
      case null:
        textClasses = 'text-sm md:text-base'
        break
    }
    switch (textAlign2) {
      case 'center':
        alignClasses = 'text-center'
        break
      case 'left':
        alignClasses = 'text-left'
        break
      case 'right':
        alignClasses = 'text-right'
        break
      case null:
        alignClasses = 'text-left'
        break
    }
    colorClasses = `text-${textColor2}`
    if (textColor2 === 'nhtbl-green-base') colorClasses = `${colorClasses} group-hover:text-black transition-color duration-300`
    return `${textClasses} ${alignClasses} ${colorClasses}`
  }
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `${
    level === 1
      ? `<h1 class="${escape(classNames(fontSize, textColor, textAlign), true) + ' font-display ' + escape(hasSvg, true)}">${each(
          segments,
          ({ type, content: content2, version, key }) => {
            return `${
              type === 'svg'
                ? `${validate_component(Emphas, 'Emphas').$$render(
                    $$result,
                    {
                      content: content2,
                      version,
                      stroke: textColor || 'black',
                    },
                    {},
                    {},
                  )}`
                : `<!-- HTML_TAG_START -->${content2}<!-- HTML_TAG_END --> `
            }`
          },
        )}</h1>`
      : ``
  } ${
    level === 2
      ? `<h2 class="${escape(classNames(fontSize, textColor, textAlign), true) + ' font-display ' + escape(hasSvg, true)}">${each(
          segments,
          ({ type, content: content2, version, key }) => {
            return `${
              type === 'svg'
                ? `${validate_component(Emphas, 'Emphas').$$render(
                    $$result,
                    {
                      content: content2,
                      version,
                      stroke: textColor || 'black',
                    },
                    {},
                    {},
                  )}`
                : `<!-- HTML_TAG_START -->${content2}<!-- HTML_TAG_END --> `
            }`
          },
        )}</h2>`
      : ``
  } ${
    level === 3
      ? `<h3 class="${escape(classNames(fontSize, textColor, textAlign), true) + ' font-display ' + escape(hasSvg, true)}">${each(
          segments,
          ({ type, content: content2, version, key }) => {
            return `${
              type === 'svg'
                ? `${validate_component(Emphas, 'Emphas').$$render(
                    $$result,
                    {
                      content: content2,
                      version,
                      stroke: textColor || 'black',
                    },
                    {},
                    {},
                  )}`
                : `<!-- HTML_TAG_START -->${content2}<!-- HTML_TAG_END --> `
            }`
          },
        )}</h3>`
      : ``
  }`
})
const HomePageHero = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const images = block.homePageHero.images.nodes
  const content = block.children
  let y
  let percentage = 100
  let pageHeight = 3e3
  let stopped = false
  let topStart = 0
  let transformString
  let bgdiv
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  {
    {
      percentage = 100 - (y / pageHeight) * 100
      stopped = false
      if (!stopped) {
        transformString = `transform: scale(${percentage}%)`
      } else transformString = `transform: scale(35%); position:absolute; top:${topStart}px`
    }
  }
  return ` <div class="${escape(stopped ? 'absolute' : 'fixed top-0', true) + ' w-full !px-0 h-screen -z-10 top-0'}"${add_attribute(
    'style',
    stopped ? `top:${topStart}px` : '',
    0,
  )}${add_attribute('this', bgdiv, 0)}>${each(images, (image, index) => {
    return `<div class="${
      'absolute top-0 left-0 w-full duration-1000 h-full object-cover transition-all ' +
      escape(percentage <= 100 - (100 / images.length) * index && percentage > 100 - (100 / images.length) * (index + 1) ? 'opacity-100' : 'opacity-0', true)
    }">${validate_component(Image, 'Image').$$render(
      $$result,
      {
        imageObject: image,
        lazy: false,
        imageSize: 'medium',
        fit: 'cover',
      },
      {},
      {},
    )} </div>`
  })}</div> <div class="h-[3000px] relative"><div${add_attribute(
    'style',
    transformString,
    0,
  )} class="box fixed flex h-screen w-screen items-center justify-center"><div class="relative h-screen w-screen bg-nhtbl-green-base my-[5wv] mx-[5wh] flex justify-center items-center p-4 md:p-8 leading-relaxed text-black"><div class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl box-container">${each(
    content,
    block2 => {
      return `${validate_component(BlockRenderer, 'BlockRenderer').$$render($$result, { block: block2 }, {}, {})}`
    },
  )}</div></div></div> <div class="fixed bottom-10 font-serif text-base text-center w-full flex flex-row justify-center">${``}</div></div>`
})
const ServicePush = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  block.attributes.backgroundColor ?? 'transparent'
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `${each(block.servicePush.service.nodes, serviceBlock => {
    return `<div class="relative transition-colors duration-300 px-4 py-8 cursor-pointer"><a${add_attribute(
      'href',
      serviceBlock.uri,
      0,
    )} class="inset-0 flex flex-col md:flex-row gap-4 alignwide"><div class="md:w-[41.66666667%]"><figure class="aspect-[3/2] overflow-hidden relative">${validate_component(
      Image,
      'Image',
    ).$$render(
      $$result,
      {
        imageObject: serviceBlock.featuredImage.node,
        imageSize: 'medium',
        fit: 'cover',
        extraClasses: 'w-full h-full absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105 w-full h-full',
      },
      {},
      {},
    )} </figure></div> <div class="transition-colors duration-300 flex flex-col gap-3 w-full">${each(block.children, childBlock => {
      return `${validate_component(BlockRenderer, 'BlockRenderer').$$render($$result, { block: childBlock, forceFull: true }, {}, {})}`
    })} <div class="flex-shrink mt-4">${validate_component(Button, 'Button').$$render(
      $$result,
      {
        font: 'sans',
        url: serviceBlock.uri,
        label: 'Find out more',
      },
      {},
      {},
    )}</div> </div></a> </div>`
  })}`
})
const CoreGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const children = block.children
  const bgColor = block.attributes.backgroundColor ?? 'white'
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `<div class="px-2 md:px-0"><div class="${'m-auto ' + escape(bgColor === 'black' && '!text-white', true)}">${each(children, (block2, index) => {
    return `${validate_component(BlockRenderer, 'BlockRenderer').$$render($$result, { block: block2 }, {}, {})}`
  })}</div></div>`
})
const CoreColumns = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const columns = block.children.length
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `<div class="${'grid md:grid-cols-' + escape(columns, true) + ' gap-7 mb-7'}">${each(block.children, (block2, index) => {
    return `${validate_component(BlockRenderer, 'BlockRenderer').$$render($$result, { block: block2 }, {}, {})}`
  })}</div>`
})
const CoreColumn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `<div>${each(block.children, (block2, index) => {
    return `${validate_component(BlockRenderer, 'BlockRenderer').$$render($$result, { block: block2 }, {}, {})}`
  })}</div>`
})
const CoreSpacer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const height = block.attributes.height ? block.attributes.height : '5px'
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `<div style="${'height:' + escape(height, true)}"></div>`
})
let maxColWidth = 1200
let gap = 30
const PortfolioBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  let items = block.portfolioBlock.portfolioItems.nodes
  let minColWidth = 140
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  {
    {
      if (typeof window !== 'undefined') {
        minColWidth = window.innerWidth >= 768 ? 420 : 140
      }
    }
  }
  return `<div class="bg-black relative -mb-24">${validate_component(Masonry, 'Masonry').$$render(
    $$result,
    {
      items,
      minColWidth,
      maxColWidth,
      gap,
      idKey: 'slug',
      animate: true,
    },
    {},
    {
      default: ({ item }) => {
        return `${validate_component(PortfolioItem, 'PortfolioItem').$$render($$result, { block: item, noLink: true }, {}, {})}`
      },
    },
  )} <div class="absolute bottom-0 h-[100vh] w-full flex flex-col justify-end bg-gradient-to-t from-black to-transparent"><div class="flex justify-center">${validate_component(
    Button,
    'Button',
  ).$$render(
    $$result,
    {
      textClass: 'text-lg',
      url: '/portfolio',
      label: 'See more work',
    },
    {},
    {},
  )}</div></div></div>`
})
const css = {
  code: '.carousel.svelte-i2qyy3{position:relative;width:100%;height:auto}',
  map: null,
}
const Carousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentSlideIndex, $$unsubscribe_currentSlideIndex
  let { images } = $$props
  let { autoplay = false } = $$props
  let currentSlideIndex = writable(0)
  $$unsubscribe_currentSlideIndex = subscribe(currentSlideIndex, value => ($currentSlideIndex = value))
  onDestroy(() => {})
  if ($$props.images === void 0 && $$bindings.images && images !== void 0) $$bindings.images(images)
  if ($$props.autoplay === void 0 && $$bindings.autoplay && autoplay !== void 0) $$bindings.autoplay(autoplay)
  $$result.css.add(css)
  $$unsubscribe_currentSlideIndex()
  return `  <div class="carousel relative aspect-video svelte-i2qyy3">${each(images, (image, index) => {
    return `${
      $currentSlideIndex === index
        ? `<div><div class="w-full aspect-video absolute inset-0">${validate_component(Image, 'Image').$$render(
            $$result,
            {
              imageObject: image,
              imageSize: 'large',
              fit: 'contain',
            },
            {},
            {},
          )}</div> </div>`
        : ``
    }`
  })} </div>`
})
const GalerieBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const images = block.galerie.galerie.nodes
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `${validate_component(Carousel, 'Carousel').$$render($$result, { autoplay: true, images }, {}, {})}`
})
const CoreButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const classNames = (fontSize, textColor) => {
    let textClasses = '',
      colorClasses = textColor ? `text-${textColor}` : ''
    switch (fontSize) {
      case 'base':
        textClasses = 'text-sans text-sm md:text-base'
        break
      case 'lg':
        textClasses = 'font-display text-base md:text-lg'
        break
      case 'xl':
        textClasses = 'font-display text-base md:text-lg lg:text-xl'
        break
      case '2xl':
        textClasses = 'font-display text-xl md:text-2xl'
        break
      case null:
        textClasses = 'text-sans text-sm md:text-base'
        break
    }
    colorClasses = `text-${textColor}`
    return `${textClasses} ${colorClasses}`
  }
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `${validate_component(Button, 'Button').$$render(
    $$result,
    {
      textClass: classNames(block.attributes.fontSize ?? null, block.attributes.textColor),
      url: block.attributes.url,
      label: block.attributes.text,
    },
    {},
    {},
  )}`
})
function justifyContentClass(justifyContent2) {
  switch (justifyContent2) {
    case 'left':
      return 'justify-start'
    case 'center':
      return 'justify-center'
    case 'right':
      return 'justify-end'
    case 'space-between':
      return 'justify-between'
    default:
      return ''
  }
}
const CoreButtons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const children = block.children
  const bgColor = block.attributes.backgroundColor ?? 'white'
  const { justifyContent } = block.attributes?.layout ?? 'left'
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `<div class="px-2 md:px-0"><div${add_attribute('class', `m-auto flex ${justifyContentClass(justifyContent)} ${bgColor === 'black' ? '!text-white' : ''}`, 0)}>${each(
    children,
    (block2, index) => {
      return `${validate_component(CoreButton, 'CoreButton').$$render($$result, { block: block2 }, {}, {})}`
    },
  )}</div></div>`
})
const AcfLinkBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props
  const children = block.children || []
  const bgColor = block.attributes?.backgroundColor ?? 'white'
  let link = block.linkBlock?.internalLink?.nodes[0].uri
  if (!link) link = block.linkBlock?.externalLink?.url
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `<a class="block"${add_attribute('href', link, 0)}><div class="${'m-auto ' + escape(bgColor === 'black' && '!text-white', true)}">${each(children, (childBlock, index) => {
    return `${validate_component(BlockRenderer, 'BlockRenderer').$$render($$result, { block: childBlock }, {}, {})}`
  })}</div></a>`
})
function mapSpacingToTailwind(styleObj) {
  let classes = ''
  const topPadding = styleObj?.spacing?.padding?.top?.replace('spacing|', '')
  const bottomPadding = styleObj?.spacing?.padding?.bottom?.replace('spacing|', '')
  if (topPadding) {
    const topValue = parseInt(topPadding, 10) / 10
    classes += ` pt-${topValue}`
  }
  if (bottomPadding) {
    const bottomValue = parseInt(bottomPadding, 10) / 10
    classes += ` pb-${bottomValue}`
  }
  return classes.trim()
}
function hasHomePageHero(block2) {
  return 'homePageHero' in block2 && block2.homePageHero !== null && block2.homePageHero !== void 0
}
function hasServicePush(block2) {
  return 'servicePush' in block2 && block2.servicePush !== null && block2.servicePush !== void 0
}
const BlockRenderer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { forceFull = false } = $$props
  let isInView
  let { block } = $$props
  let align = block.attributes?.align || 'none'
  if (forceFull) align = 'full'
  const bgColor = block.attributes?.backgroundColor ?? 'white'
  const spacingClasses = block.attributes?.style ? mapSpacingToTailwind(block.attributes.style) : ''
  const classNames = align2 => {
    let baseClasses = ''
    switch (align2) {
      case 'full':
        baseClasses = 'w-full max-w-full'
        break
      case 'wide':
        baseClasses = 'w-full max-w-[980px] mx-auto'
        break
      case 'none':
        baseClasses = 'w-full max-w-[852px] mx-auto'
        break
      case 'center':
        baseClasses = 'w-full max-w-[852px] mx-auto'
        break
      case null:
        baseClasses = 'w-full'
        break
    }
    return `${baseClasses} ${spacingClasses}`
  }
  const blockName = block.name || ''
  if ($$props.forceFull === void 0 && $$bindings.forceFull && forceFull !== void 0) $$bindings.forceFull(forceFull)
  if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block)
  return `<div class="${escape(classNames(align), true) + ' bg-' + escape(bgColor, true) + ' !px-0'}"><div class="${
    'transition-all duration-[800ms] ease-in-out ' + escape(' translate-y-2 opacity-0.2', true)
  }"${add_attribute('data-inview', isInView, 0)}>${hasHomePageHero(block) ? `${validate_component(HomePageHero, 'HomePageHero').$$render($$result, { block }, {}, {})}` : ``} ${
    hasServicePush(block) ? `${validate_component(ServicePush, 'ServicePush').$$render($$result, { block }, {}, {})}` : ``
  } ${blockName === 'core/group' ? `${validate_component(CoreGroup, 'CoreGroup').$$render($$result, { block }, {}, {})}` : ``} ${
    blockName === 'core/buttons' ? `${validate_component(CoreButtons, 'CoreButtons').$$render($$result, { block }, {}, {})}` : ``
  } ${blockName === 'core/button' ? `${validate_component(CoreButton, 'CoreButton').$$render($$result, { block }, {}, {})}` : ``} ${
    blockName === 'core/columns' ? `${validate_component(CoreColumns, 'CoreColumns').$$render($$result, { block }, {}, {})}` : ``
  } ${blockName === 'core/column' ? `${validate_component(CoreColumn, 'CoreColumn').$$render($$result, { block }, {}, {})}` : ``} ${
    blockName === 'core/paragraph' ? `${validate_component(CoreParagraph, 'CoreParagraph').$$render($$result, { block }, {}, {})}` : ``
  } ${blockName === 'core/heading' ? `${validate_component(CoreHeading, 'CoreHeading').$$render($$result, { block }, {}, {})}` : ``} ${
    blockName === 'core/spacer' ? `${validate_component(CoreSpacer, 'CoreSpacer').$$render($$result, { block }, {}, {})}` : ``
  } ${blockName === 'acf/portfolio-block' ? `${validate_component(PortfolioBlock, 'PortfolioBlock').$$render($$result, { block }, {}, {})}` : ``} ${
    blockName === 'acf/galerie' ? `${validate_component(GalerieBlock, 'GalerieBlock').$$render($$result, { block }, {}, {})}` : ``
  } ${blockName === 'acf/link-block' ? `${validate_component(AcfLinkBlock, 'AcfLinkBlock').$$render($$result, { block }, {}, {})}` : ``}</div></div>`
})
export { BlockRenderer as B }
