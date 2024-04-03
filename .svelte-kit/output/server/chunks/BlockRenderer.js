import { c as create_ssr_component, a as add_attribute, e as escape, d as each, v as validate_component, b as subscribe, o as onDestroy } from "./index3.js";
import { I as Image, M as Masonry, P as PortfolioItem } from "./Masonry.js";
import { w as writable } from "./index2.js";
const CoreParagraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  const { content, fontSize, textColor, textAlign } = block.attributes;
  const classNames = (fontSize2, textColor2, textAlign2) => {
    let textClasses, alignClasses, colorClasses = "";
    switch (fontSize2) {
      case "base":
        textClasses = "text-sans text-sm md:text-base";
        break;
      case "lg":
        textClasses = "font-display text-base md:text-lg";
        break;
      case "xl":
        textClasses = "font-display text-lg md:text-xl";
        break;
      case "2xl":
        textClasses = "font-display text-xl md:text-2xl";
        break;
      case null:
        textClasses = "text-sans text-sm md:text-base";
        break;
    }
    switch (textAlign2) {
      case "center":
        alignClasses = "text-center";
        break;
      case "left":
        alignClasses = "text-left";
        break;
      case "right":
        alignClasses = "text-right";
        break;
      case null:
        alignClasses = "text-left";
        break;
    }
    colorClasses = `text-${textColor2}`;
    return `${textClasses} ${alignClasses} ${colorClasses}`;
  };
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `
<p${add_attribute("class", classNames(fontSize, textColor, textAlign), 0)}><!-- HTML_TAG_START -->${content}<!-- HTML_TAG_END --></p>`;
});
const CoreHeading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  const { content, fontSize, textColor, textAlign, level } = block.attributes;
  const classNames = (fontSize2, textColor2, textAlign2) => {
    let textClasses, alignClasses, colorClasses = "";
    switch (fontSize2) {
      case "base":
        textClasses = "text-sm md:text-base";
        break;
      case "lg":
        textClasses = "text-base md:text-lg";
        break;
      case "xl":
        textClasses = "text-lg md:text-xl";
        break;
      case "2xl":
        textClasses = "text-xl md:text-2xl";
        break;
      case null:
        textClasses = "text-sm md:text-base";
        break;
    }
    switch (textAlign2) {
      case "center":
        alignClasses = "text-center";
        break;
      case "left":
        alignClasses = "text-left";
        break;
      case "right":
        alignClasses = "text-right";
        break;
      case null:
        alignClasses = "text-left";
        break;
    }
    colorClasses = `text-${textColor2}`;
    return `${textClasses} ${alignClasses} ${colorClasses}`;
  };
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `${level === 1 ? `<h1 class="${escape(classNames(fontSize, textColor, textAlign), true) + " font-display"}"><!-- HTML_TAG_START -->${content}<!-- HTML_TAG_END --></h1>` : ``}
${level === 2 ? `<h2 class="${escape(classNames(fontSize, textColor, textAlign), true) + " font-display"}"><!-- HTML_TAG_START -->${content}<!-- HTML_TAG_END --></h2>` : ``}
${level === 3 ? `<h3 class="${escape(classNames(fontSize, textColor, textAlign), true) + " font-display"}"><!-- HTML_TAG_START -->${content}<!-- HTML_TAG_END --></h3>` : ``}`;
});
const HomePageHero = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  const images = block.homePageHero.images.nodes;
  const content = block.children;
  let y;
  let percentage = 100;
  let pageHeight = 3e3;
  let stopped = false;
  let topStart = 0;
  let transformString;
  let bgdiv;
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  {
    {
      percentage = 100 - y / pageHeight * 100;
      stopped = false;
      if (!stopped) {
        transformString = `transform: scale(${percentage}%)`;
      } else
        transformString = `transform: scale(35%); position:absolute; top:${topStart}px`;
    }
  }
  return `
<div class="${escape(stopped ? "absolute" : "fixed top-0", true) + " w-full !px-0 h-screen -z-10 top-0"}"${add_attribute("style", stopped ? `top:${topStart}px` : "", 0)}${add_attribute("this", bgdiv, 0)}>${each(images, (image, index) => {
    return `<div class="${"absolute top-0 left-0 w-full duration-1000 h-full object-cover transition-all " + escape(
      percentage <= 100 - 100 / images.length * index && percentage > 100 - 100 / images.length * (index + 1) ? "opacity-100" : "opacity-0",
      true
    )}">${validate_component(Image, "Image").$$render(
      $$result,
      {
        imageObject: image,
        imageSize: "large",
        fit: "cover"
      },
      {},
      {}
    )}
  </div>`;
  })}</div>
<div class="h-[3000px] relative"><div${add_attribute("style", transformString, 0)} class="box fixed flex h-screen w-screen items-center justify-center"><div class="relative h-screen w-screen bg-nhtbl-green-base my-[5wv] mx-[5wh] flex justify-center items-center p-4 md:p-8 leading-relaxed text-black"><div class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl box-container">${each(content, (block2) => {
    return `${validate_component(BlockRenderer, "BlockRenderer").$$render($$result, { block: block2 }, {}, {})}`;
  })}</div></div></div>
  <div class="fixed bottom-10 font-serif text-base text-center w-full">${percentage > 90 ? `Scroll for more...` : `${percentage > 1 && !stopped ? `<span class="text-white">Keep scrolling...</span>` : ``}`}</div>
</div>`;
});
const ServicePush = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  const imageObject = block.servicePush.service.nodes[0].featuredImage.node;
  const uri = block.servicePush.service.nodes[0].uri;
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `<div class="group aspect-video rotate-1 max-w-[750px] relative bg-nhtbl-green-base mb-12 transition-colors duration-300 hover:bg-nhtbl-purple-base"><a${add_attribute("href", uri, 0)} class="block absolute inset-0"><div class="absolute inset-0 -z-0">${validate_component(Image, "Image").$$render(
    $$result,
    {
      imageObject,
      imageSize: "medium_large",
      fit: "cover"
    },
    {},
    {}
  )}</div>
    <div class="absolute bottom-0 left-0 w-full py-3 px-6 bg-nhtbl-green-base group-hover:bg-nhtbl-purple-base transition-colors duration-300">${each(block.children, (block2) => {
    return `${validate_component(BlockRenderer, "BlockRenderer").$$render($$result, { block: block2 }, {}, {})}`;
  })}</div></a></div>`;
});
const CoreGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  const children = block.children;
  const bgColor = block.attributes.backgroundColor ?? "white";
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `<div class="px-2 md:px-0"><div class="${"m-auto " + escape(bgColor === "black" && "!text-white", true)}">${each(children, (block2, index) => {
    return `${validate_component(BlockRenderer, "BlockRenderer").$$render($$result, { block: block2, removePadding: true }, {}, {})}`;
  })}</div></div>`;
});
const CoreColumns = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  const columns = block.children.length;
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `<div class="${"grid grid-cols-" + escape(columns, true) + " gap-7 mb-7"}">${each(block.children, (block2, index) => {
    return `${validate_component(BlockRenderer, "BlockRenderer").$$render($$result, { block: block2 }, {}, {})}`;
  })}</div>`;
});
const CoreColumn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `<div>${each(block.children, (block2, index) => {
    return `${validate_component(BlockRenderer, "BlockRenderer").$$render($$result, { block: block2 }, {}, {})}`;
  })}</div>`;
});
const CoreSpacer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  const height = block.attributes.height ? block.attributes.height : "5px";
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `<div style="${"height:" + escape(height, true)}"></div>`;
});
const PortfolioBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  let [minColWidth, maxColWidth, gap] = [400, 800, 30];
  let items = block.portfolioBlock.portfolioItems.nodes;
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
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
const Carousel_svelte_svelte_type_style_lang = "";
const css = {
  code: ".carousel.svelte-i2qyy3{position:relative;width:100%;height:auto}",
  map: null
};
const Carousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentSlideIndex, $$unsubscribe_currentSlideIndex;
  let { images } = $$props;
  let { autoplay = false } = $$props;
  let currentSlideIndex = writable(0);
  $$unsubscribe_currentSlideIndex = subscribe(currentSlideIndex, (value) => $currentSlideIndex = value);
  onDestroy(() => {
  });
  if ($$props.images === void 0 && $$bindings.images && images !== void 0)
    $$bindings.images(images);
  if ($$props.autoplay === void 0 && $$bindings.autoplay && autoplay !== void 0)
    $$bindings.autoplay(autoplay);
  $$result.css.add(css);
  $$unsubscribe_currentSlideIndex();
  return `


<div class="carousel relative aspect-video svelte-i2qyy3">${each(images, (image, index) => {
    return `${$currentSlideIndex === index ? `<div><div class="w-full aspect-video absolute inset-0">${validate_component(Image, "Image").$$render(
      $$result,
      {
        imageObject: image,
        imageSize: "large",
        fit: "contain"
      },
      {},
      {}
    )}</div>
        </div>` : ``}`;
  })}
  </div>`;
});
const GalerieBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  const images = block.galerie.galerie.nodes;
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `${validate_component(Carousel, "Carousel").$$render($$result, { autoplay: true, images }, {}, {})}`;
});
function isACFHomePageHero(block2) {
  return block2.homePageHero !== void 0;
}
function isACFServicePush(block2) {
  return block2.servicePush !== void 0;
}
function mapSpacingToTailwind(styleObj) {
  let classes = "";
  const topPadding = styleObj?.spacing?.padding?.top?.replace("spacing|", "");
  const bottomPadding = styleObj?.spacing?.padding?.bottom?.replace("spacing|", "");
  if (topPadding) {
    const topValue = parseInt(topPadding, 10) / 10;
    classes += ` pt-${topValue}`;
  }
  if (bottomPadding) {
    const bottomValue = parseInt(bottomPadding, 10) / 10;
    classes += ` pb-${bottomValue}`;
  }
  return classes.trim();
}
const BlockRenderer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  const align = block.attributes.align || "none";
  const bgColor = block.attributes.backgroundColor ?? "white";
  const spacingClasses = block.attributes.style ? mapSpacingToTailwind(block.attributes.style) : "";
  const classNames = (align2) => {
    let baseClasses = "";
    switch (align2) {
      case "full":
        baseClasses = "w-full max-w-full";
        break;
      case "wide":
        baseClasses = "w-full max-w-[980px] mx-auto";
        break;
      case "none":
        baseClasses = "w-full max-w-[852px] mx-auto";
        break;
      case null:
        baseClasses = "w-full";
        break;
    }
    return `${baseClasses} ${spacingClasses}`;
  };
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `<div class="${escape(classNames(align), true) + " bg-" + escape(bgColor, true) + " !px-0"}">${isACFHomePageHero(block) ? `${validate_component(HomePageHero, "HomePageHero").$$render($$result, { block }, {}, {})}` : ``}

  ${isACFServicePush(block) ? `${validate_component(ServicePush, "ServicePush").$$render($$result, { block }, {}, {})}` : ``}

  ${block.name === "core/group" ? `${validate_component(CoreGroup, "CoreGroup").$$render($$result, { block }, {}, {})}` : ``}

  ${block.name === "core/columns" ? `${validate_component(CoreColumns, "CoreColumns").$$render($$result, { block }, {}, {})}` : ``}

  ${block.name === "core/column" ? `${validate_component(CoreColumn, "CoreColumn").$$render($$result, { block }, {}, {})}` : ``}

  ${block.name === "core/paragraph" ? `${validate_component(CoreParagraph, "CoreParagraph").$$render($$result, { block }, {}, {})}` : ``}

  ${block.name === "core/heading" ? `${validate_component(CoreHeading, "CoreHeading").$$render($$result, { block }, {}, {})}` : ``}

  ${block.name === "core/spacer" ? `${validate_component(CoreSpacer, "CoreSpacer").$$render($$result, { block }, {}, {})}` : ``}

  ${block.name === "acf/portfolio-block" ? `${validate_component(PortfolioBlock, "PortfolioBlock").$$render($$result, { block }, {}, {})}` : ``}

  ${block.name === "acf/galerie" ? `${validate_component(GalerieBlock, "GalerieBlock").$$render($$result, { block }, {}, {})}` : ``}</div>`;
});
export {
  BlockRenderer as B
};
