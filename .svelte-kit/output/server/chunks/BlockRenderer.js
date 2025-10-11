import { U as current_component, f as fallback, e as escape_html, b as bind_props, a as pop, p as push, k as ensure_array_like, d as attr_class, i as stringify, c as attr, o as attr_style, g as clsx, l as slot, V as invalid_default_snippet, j as store_get, u as unsubscribe_stores } from "./index2.js";
import { f as findImageSizeData, g as getSrcSet } from "./utilities.js";
import { g as getDisplayMode } from "./portfolioResolver.js";
import { w as writable } from "./index.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
Promise.resolve();
function Emphas($$payload, $$props) {
  push();
  let version = fallback($$props["version"], "bubble");
  let content = fallback($$props["content"], "");
  let stroke = fallback($$props["stroke"], "black");
  if (stroke === null)
    stroke = "black";
  if (version === "bubble") {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<span class="relative inline-block">${escape_html(content)} <div class="absolute -inset-10"><svg width="421" height="169" viewBox="-10 -10 441 189" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" preserveAspectRatio="none">`);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></svg></div></span>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (version === "line") {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<span class="relative inline-block"><strong>${escape_html(content)}</strong> <div class="absolute left-0 right-0 -bottom-1"><svg width="373" height="9" viewBox="0 0 373 9" fill="none" class="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">`);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></svg></div></span>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { version, content, stroke });
  pop();
}
function CoreParagraph($$payload, $$props) {
  push();
  let block = $$props["block"];
  const { content, fontSize, textColor, align, fontFamily } = block.attributes || {};
  let segments = [];
  const classNames = (fontSize2, textColor2, align2, fontFamily2) => {
    let textClasses, alignClasses, colorClasses = "";
    let fontClass = "";
    if (fontFamily2) {
      fontClass = `font-${fontFamily2}`;
    } else {
      switch (fontSize2) {
        case "base":
          fontClass = "font-sans";
          break;
        case "lg":
        case "xl":
        case "2xl":
          fontClass = "font-display";
          break;
        case null:
        default:
          fontClass = "font-sans";
          break;
      }
    }
    switch (fontSize2) {
      case "base":
        textClasses = `${fontClass} text-sm md:text-base`;
        break;
      case "lg":
        textClasses = `${fontClass} text-base md:text-lg`;
        break;
      case "xl":
        textClasses = `${fontClass} text-lg md:text-xl`;
        break;
      case "2xl":
        textClasses = `${fontClass} text-xl md:text-2xl`;
        break;
      case null:
      default:
        textClasses = `${fontClass} text-sm md:text-base`;
        break;
    }
    switch (align2) {
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
    if (textColor2 === "nhtbl-green-base")
      colorClasses = `${colorClasses} group-hover:text-black transition-color`;
    return `${textClasses} ${alignClasses} ${colorClasses}`;
  };
  const each_array = ensure_array_like(segments);
  $$payload.out.push(`<p${attr_class(`${stringify(classNames(fontSize, textColor, align, fontFamily))} mb-2`)}><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let { type, content: content2, version, key } = each_array[$$index];
    if (type === "svg") {
      $$payload.out.push("<!--[-->");
      Emphas($$payload, { content: content2, version, stroke: textColor || "black" });
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`${html(content2)}`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></p>`);
  bind_props($$props, { block });
  pop();
}
function CoreHeading($$payload, $$props) {
  push();
  let block = $$props["block"];
  const { content, fontSize, textColor, textAlign, level } = block.attributes || {};
  let segments = [];
  let hasSvg = false;
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
    if (textColor2 === "nhtbl-green-base")
      colorClasses = `${colorClasses} group-hover:text-black transition-color duration-300`;
    return `${textClasses} ${alignClasses} ${colorClasses}`;
  };
  if (level === 1) {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(segments);
    $$payload.out.push(`<h1${attr_class(`${stringify(classNames(fontSize, textColor, textAlign))} font-display ${stringify(hasSvg)}`)}><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let { type, content: content2, version, key } = each_array[$$index];
      if (type === "svg") {
        $$payload.out.push("<!--[-->");
        Emphas($$payload, { content: content2, version, stroke: textColor || "black" });
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`${html(content2)}`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></h1>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (level === 2) {
    $$payload.out.push("<!--[-->");
    const each_array_1 = ensure_array_like(segments);
    $$payload.out.push(`<h2${attr_class(`${stringify(classNames(fontSize, textColor, textAlign))} font-display mb-2 ${stringify(hasSvg)}`)}><!--[-->`);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let { type, content: content2, version, key } = each_array_1[$$index_1];
      if (type === "svg") {
        $$payload.out.push("<!--[-->");
        Emphas($$payload, { content: content2, version, stroke: textColor || "black" });
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`${html(content2)}`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></h2>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (level === 3) {
    $$payload.out.push("<!--[-->");
    const each_array_2 = ensure_array_like(segments);
    $$payload.out.push(`<h3${attr_class(`${stringify(classNames(fontSize, textColor, textAlign))} font-display ${stringify(hasSvg)}`)}><!--[-->`);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let { type, content: content2, version, key } = each_array_2[$$index_2];
      if (type === "svg") {
        $$payload.out.push("<!--[-->");
        Emphas($$payload, { content: content2, version, stroke: textColor || "black" });
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`${html(content2)}`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></h3>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { block });
  pop();
}
function Image$1($$payload, $$props) {
  push();
  let imageObject = $$props["imageObject"];
  let lazy = fallback($$props["lazy"], true);
  let imageSize = $$props["imageSize"];
  let fit = fallback($$props["fit"], "none");
  let extraClasses = fallback($$props["extraClasses"], "");
  const src = findImageSizeData("sourceUrl", imageObject.mediaDetails.sizes, imageSize);
  const width = findImageSizeData("width", imageObject.mediaDetails.sizes, imageSize);
  const height = findImageSizeData("height", imageObject.mediaDetails.sizes, imageSize);
  $$payload.out.push(`<img${attr("loading", lazy ? "lazy" : "eager")}${attr_class(`w-full h-full object-${fit} ${extraClasses}`)}${attr("src", src)}${attr("alt", imageObject.altText)}${attr("width", width)}${attr("height", height)}/>`);
  bind_props($$props, { imageObject, lazy, imageSize, fit, extraClasses });
  pop();
}
function HomePageHero($$payload, $$props) {
  push();
  let block = $$props["block"];
  const images = block.homePageHero.images.nodes;
  const content = block.children;
  let y;
  let percentage = 100;
  let pageHeight = 3e3;
  let stopped = false;
  let topStart = 0;
  let transformString;
  let isMounted = false;
  {
    percentage = 100 - y / pageHeight * 100;
    stopped = false;
    if (stopped) {
      isMounted = false;
    } else if (!stopped && !isMounted) {
      isMounted = true;
    }
    if (!stopped) {
      transformString = `transform: scale(${percentage}%)`;
    } else
      transformString = `transform: scale(35%); position:absolute; top:${topStart}px`;
  }
  const each_array = ensure_array_like(images);
  const each_array_1 = ensure_array_like(content);
  $$payload.out.push(`<div${attr_class(`${stringify(stopped ? "absolute" : "fixed top-0")} w-full !px-0 h-screen -z-10 top-0`)}${attr_style(stopped ? `top:${topStart}px` : "")}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let image = each_array[index];
    const imageThreshold = 100 / images.length;
    const imageStart = imageThreshold * index;
    const imageEnd = imageThreshold * (index + 1);
    const shouldBeVisible = percentage >= imageStart && percentage < imageEnd;
    $$payload.out.push(`<div${attr_class(`absolute top-0 left-0 w-full duration-1000 h-full object-cover transition-all ${stringify(shouldBeVisible ? "opacity-100" : "opacity-0")}`)}>`);
    Image$1($$payload, {
      imageObject: image,
      lazy: false,
      imageSize: "medium",
      fit: "cover"
    });
    $$payload.out.push(`<!----></div>`);
  }
  $$payload.out.push(`<!--]--></div> <div class="h-[3000px] relative"><div${attr_style(transformString)} class="box fixed flex h-screen w-screen items-center justify-center"><div class="relative h-screen w-screen bg-white my-[5wv] mx-[5wh] flex justify-center items-center p-4 md:p-8 leading-relaxed text-black"><div class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl box-container"><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let block2 = each_array_1[$$index_1];
    BlockRenderer($$payload, { block: block2 });
  }
  $$payload.out.push(`<!--]--></div></div></div> <div class="fixed bottom-10 font-serif text-base text-center w-full flex flex-row justify-center">`);
  if (isMounted) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<svg fill="none" width="49" height="73" viewBox="0 0 49 73" xmlns="http://www.w3.org/2000/svg"><path vector-effect="non-scaling-stroke"${attr_class("stroke-[3px]", void 0, {
      "stroke-black": percentage > 90 && percentage <= 100,
      "stroke-nhtbl-green-base": percentage > 1 && percentage <= 90 && !stopped
    })} d="M32.88 57.21C28.01 62.25 23.14 67.3 18.27 72.34C12.05 67.64 6.09002 62.74 0.400024 57.64C0.660024 57.98 0.920024 58.32 1.17002 58.67" stroke-miterlimit="10"></path><path vector-effect="non-scaling-stroke"${attr_class("stroke-[3px]", void 0, {
      "stroke-black": percentage > 90 && percentage <= 100,
      "stroke-nhtbl-green-base": percentage > 1 && percentage <= 90 && !stopped
    })} d="M48.6701 0.5C38.0201 0.84 28.1201 9.02 25.7701 19.41C24.8701 23.37 25.0301 27.71 27.0101 31.26C28.9901 34.81 33.0001 37.35 37.0301 36.86C41.0601 36.37 44.5301 32.31 43.7401 28.33C43.0001 24.6 39.1101 22.22 35.3301 21.75C26.1701 20.63 17.7401 28.39 15.1601 37.25C12.5801 46.11 14.5101 55.62 17.1001 64.48C17.7301 66.64 18.4101 68.9 17.9901 71.11" stroke-miterlimit="10"></path></svg>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div>`);
  bind_props($$props, { block });
  pop();
}
function Button($$payload, $$props) {
  let {
    label = "Read more",
    url = "/",
    active = false,
    font = "display",
    textClass = "text-base",
    colourClass = "bg-nhtbl-green-base border-black border",
    textColourClass = "text-black"
  } = $$props;
  $$payload.out.push(`<a${attr("href", url)}${attr_class(`${stringify(colourClass)} rounded-full transition-all duration-500 hover:bg-black hover:text-nhtbl-green-base hover:border-nhtbl-green-base pt-3 ${stringify(font === "display" ? "pb-2" : "pb-3")} px-4 ${stringify(textClass)} ${stringify(textColourClass)} font-${stringify(font)} cursor-pointer`)} role="button">${escape_html(label)}</a>`);
}
function ServicePush($$payload, $$props) {
  push();
  let block = $$props["block"];
  block.attributes.backgroundColor ?? "transparent";
  const each_array = ensure_array_like(block.servicePush.service.nodes);
  $$payload.out.push(`<!--[-->`);
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let serviceBlock = each_array[$$index_1];
    const each_array_1 = ensure_array_like(block.children);
    $$payload.out.push(`<div class="relative transition-colors duration-300 px-4 py-8 cursor-pointer"><a${attr("href", serviceBlock.uri)} class="inset-0 flex flex-col md:flex-row gap-4 alignwide"><div class="md:w-[41.66666667%]"><figure class="aspect-[3/2] overflow-hidden relative">`);
    Image$1($$payload, {
      imageObject: serviceBlock.featuredImage.node,
      imageSize: "medium",
      fit: "cover",
      extraClasses: "w-full h-full absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105 w-full h-full"
    });
    $$payload.out.push(`<!----></figure></div> <div class="transition-colors duration-300 flex flex-col gap-3 w-full"><!--[-->`);
    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
      let childBlock = each_array_1[$$index];
      BlockRenderer($$payload, { block: childBlock, forceFull: true });
    }
    $$payload.out.push(`<!--]--> <div class="flex-shrink mt-4">`);
    Button($$payload, { font: "sans", url: serviceBlock.uri, label: "Find out more" });
    $$payload.out.push(`<!----></div></div></a></div>`);
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { block });
  pop();
}
function CoreGroup($$payload, $$props) {
  push();
  let block = $$props["block"];
  const children = block.children || [];
  const bgColor = block.attributes?.backgroundColor ?? "white";
  const each_array = ensure_array_like(children);
  $$payload.out.push(`<div class="px-2 md:px-0"><div${attr_class(`m-auto ${stringify(bgColor === "black" && "!text-white")}`)}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let block2 = each_array[index];
    BlockRenderer($$payload, { block: block2 });
  }
  $$payload.out.push(`<!--]--></div></div>`);
  bind_props($$props, { block });
  pop();
}
function CoreColumns($$payload, $$props) {
  push();
  let { block } = $$props;
  const isStackedOnMobile = block.attributes?.isStackedOnMobile ?? false;
  function getGridTemplateColumns() {
    const children = block.children || [];
    return children.map((child) => child.attributes?.width || "1fr").join(" ") || "1fr";
  }
  function getGridStyle() {
    const gridTemplateColumns = getGridTemplateColumns();
    return `grid-template-columns: ${gridTemplateColumns};`;
  }
  function getCssClasses() {
    const baseClasses = `${block.attributes?.className || ""} corecolumns grid`;
    return baseClasses.trim();
  }
  const each_array = ensure_array_like(block.children || []);
  $$payload.out.push(`<div${attr_class(`${stringify(getCssClasses())} gap-4`, "svelte-ppzgs5")}${attr("data-stacked", isStackedOnMobile)}${attr_style(isStackedOnMobile ? `grid-template-columns: 1fr; --grid-columns: ${getGridTemplateColumns()};` : getGridStyle())}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let childBlock = each_array[index];
    BlockRenderer($$payload, { block: childBlock });
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
function CoreColumn($$payload, $$props) {
  push();
  let { block } = $$props;
  const verticalAlignment = block.attributes?.verticalAlignment || "top";
  const getAlignmentClass = (alignment) => {
    switch (alignment) {
      case "top":
        return "self-start";
      case "center":
        return "self-center justify-center";
      case "bottom":
        return "self-end justify-end";
      case "stretch":
        return "self-stretch";
      default:
        return "self-start";
    }
  };
  const alignmentClass = getAlignmentClass(verticalAlignment);
  const customClasses = block.attributes?.className || "";
  const each_array = ensure_array_like(block.children || []);
  $$payload.out.push(`<div${attr_class(`flex flex-col h-full ${stringify(alignmentClass)} ${stringify(customClasses)}`, "svelte-4ecaoa")}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let childBlock = each_array[index];
    BlockRenderer($$payload, { block: childBlock });
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
function CoreSpacer($$payload, $$props) {
  push();
  let block = $$props["block"];
  const height = block.attributes?.height ? block.attributes.height : "5px";
  $$payload.out.push(`<div${attr_style(`height:${stringify(height)}`)}></div>`);
  bind_props($$props, { block });
  pop();
}
function Image($$payload, $$props) {
  push();
  let {
    imageObject,
    lazy = true,
    imageSize = "thumbnail",
    fit = "none",
    extraClasses = "",
    shadow = false,
    aspect = "auto"
  } = $$props;
  const sizes = imageObject?.mediaDetails?.sizes?.filter((size) => size !== null && typeof size.name === "string").map((size) => ({
    sourceUrl: size.sourceUrl ?? "",
    width: parseInt(size.width ?? "0"),
    height: parseInt(size.height ?? "0"),
    name: size.name
  })) ?? [];
  const src = findImageSizeData("sourceUrl", sizes, imageSize);
  const width = findImageSizeData("width", sizes, imageSize);
  const height = findImageSizeData("height", sizes, imageSize);
  const altText = imageObject.altText ?? "";
  function determineSizes(sizeName) {
    switch (sizeName) {
      case "thumbnail":
        return "(max-width: 600px) 50vw, (max-width: 1200px) 50vw, 25vw";
      case "medium":
        return "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw";
      case "medium_large":
        return "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw";
      case "large":
        return "(max-width: 1200px) 100vw, 50vw";
      default:
        return "100vw";
    }
  }
  const srcsetLabels = determineSizes(imageSize);
  $$payload.out.push(`<div${attr_class(`relative w-full max-w-none flex justify-center ${stringify(aspect === "square" ? "aspect-square" : `h-full aspect-${aspect}`)}`)}><img${attr("loading", lazy ? "lazy" : "eager")}${attr_class(`${fit === "contain" ? "w-auto" : "w-full"} h-full ${fit === "cover" ? "object-cover" : fit === "contain" ? "object-contain" : fit === "fill" ? "object-fill" : "object-none"} ${shadow ? "drop-shadow-lg" : ""} ${extraClasses}`)}${attr("src", src)}${attr("alt", altText)}${attr("width", width)}${attr("height", height)}${attr("srcset", getSrcSet(sizes))}${attr("sizes", srcsetLabels)}/></div>`);
  pop();
}
function FeaturedProject($$payload, $$props) {
  push();
  let {
    project,
    displayMode = "block",
    enableSearch = false,
    onServiceClick
  } = $$props;
  const imageObject = {
    altText: project.featuredImage?.node?.altText ?? "",
    mediaDetails: {
      sizes: project.featuredImage?.node?.mediaDetails?.sizes?.map((size) => ({
        name: size?.name ?? "",
        sourceUrl: size?.sourceUrl ?? "",
        width: size?.width ?? "",
        height: size?.height ?? ""
      })) ?? []
    },
    contentTypeName: "attachment",
    databaseId: 0,
    id: project.slug ?? "",
    mediaItemId: 0,
    isComment: false,
    isTermNode: false,
    isContentNode: true,
    isFrontPage: false,
    isPostsPage: false,
    slug: project.slug ?? "",
    uri: project.slug ?? ""
  };
  const formatYearRange = (startDate, endDate) => {
    if (!startDate && !endDate) {
      return "";
    }
    if (!startDate && endDate) {
      const endYear = new Date(endDate).getFullYear();
      return `(${endYear})`;
    }
    if (startDate && !endDate) {
      const startYear = new Date(startDate).getFullYear();
      return `(${startYear} –)`;
    }
    if (startDate && endDate) {
      const startYear = new Date(startDate).getFullYear();
      const endYear = new Date(endDate).getFullYear();
      if (startYear === endYear) {
        return `(${startYear})`;
      } else {
        const endYearShort = endYear.toString().slice(-2);
        return `(${startYear}–${endYearShort})`;
      }
    }
    return "";
  };
  const yearDisplay = formatYearRange(project.projectData?.startDate, project.projectData?.endDate);
  const headingBlock = {
    attributes: {
      content: project.title,
      fontSize: "lg",
      textAlign: "left",
      level: 3
    },
    isDynamic: false,
    name: "core/heading",
    type: "core/heading"
  };
  const clientNames = project.nhtblClients?.nodes?.map((client) => client?.name).filter(Boolean).join(", ") ?? "";
  const serviceNames = project.nhtblServices?.nodes?.filter((service) => service?.parentId !== null && service?.parentId !== void 0)?.map((service) => service?.name)?.filter(Boolean) ?? [];
  if (displayMode === "masonryBlock") {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<article class="featured-project"><a${attr("href", project.uri)}><div class="cursor-pointer relative" role="button" tabindex="0">`);
    Image($$payload, { imageObject, imageSize: "medium", fit: "contain" });
    $$payload.out.push(`<!----> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></a></article>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<article class="featured-project p-2 group hover:bg-white transition-all rounded-lg hover:!text-black"><a${attr_class(clsx(displayMode === "block" ? "contents" : "grid grid-cols-[1fr_4fr] gap-4"))}${attr("href", project.uri)}><div${attr_class(`mb-4 aspect-[4/3] ${stringify(displayMode === "block" ? "w-full" : "w-20 lg:w-56")}`)}>`);
    Image($$payload, {
      imageObject,
      imageSize: "large",
      fit: "cover",
      extraClasses: "w-full"
    });
    $$payload.out.push(`<!----></div> <div${attr_class(clsx(displayMode === "block" ? "contents" : "flex flex-col"))}>`);
    CoreHeading($$payload, { block: headingBlock });
    $$payload.out.push(`<!----> <div class="mb-4 max-w-md">${html(project.excerpt ?? "")}</div> `);
    if (clientNames) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<p class="text-sm text-gray-600">With/for: ${escape_html(clientNames)} ${escape_html(yearDisplay ? ` ${yearDisplay}` : "")}</p>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (serviceNames.length > 0) {
      $$payload.out.push("<!--[-->");
      const each_array_1 = ensure_array_like(serviceNames);
      $$payload.out.push(`<div class="services flex flex-row gap-2 mt-4 flex-wrap"><!--[-->`);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let serviceName = each_array_1[$$index_1];
        if (enableSearch && onServiceClick) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<button class="group-hover:border-black font-sans text-sm rounded-full border border-white px-2 py-0 whitespace-nowrap hover:bg-black/20 transition-colors cursor-pointer">${escape_html(serviceName)}</button>`);
        } else {
          $$payload.out.push("<!--[!-->");
          $$payload.out.push(`<div class="group-hover:border-black font-sans text-sm rounded-full border border-white px-2 py-0 whitespace-nowrap">${escape_html(serviceName)}</div>`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></a></article>`);
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
function Masonry($$payload, $$props) {
  push();
  let nCols, itemsToCols;
  let animate = fallback($$props["animate"], true);
  let columnClass = fallback($$props["columnClass"], () => ``, true);
  let duration = fallback($$props["duration"], 200);
  let gap = fallback($$props["gap"], 20);
  let getId = fallback($$props["getId"], (item) => {
    if (typeof item === `number`)
      return item;
    if (typeof item === `string`)
      return item;
    return item[idKey];
  });
  let idKey = fallback($$props["idKey"], () => `id`, true);
  let items = $$props["items"];
  let masonryHeight = fallback($$props["masonryHeight"], 0);
  let masonryWidth = fallback($$props["masonryWidth"], 0);
  let maxColWidth = fallback($$props["maxColWidth"], 500);
  let minColWidth = fallback($$props["minColWidth"], 330);
  let style = fallback($$props["style"], () => ``, true);
  let className = fallback($$props["class"], () => ``, true);
  nCols = Math.min(items.length, Math.floor(masonryWidth / (minColWidth + gap)) || 1);
  itemsToCols = items.reduce(
    (cols, item, idx) => {
      cols[idx % cols.length].push([item, idx]);
      return cols;
    },
    Array(nCols).fill(null).map(() => [])
    // prettier-ignore
  );
  const each_array = ensure_array_like(itemsToCols);
  $$payload.out.push(`<div${attr_class(`masonry ${stringify(className)}`, "svelte-19n3mud")}${attr_style(`gap: ${stringify(gap)}px; ${stringify(style)}`)}><!--[-->`);
  for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
    let col = each_array[$$index_2];
    $$payload.out.push(`<div${attr_class(`col ${stringify(columnClass)}`, "svelte-19n3mud")}${attr_style(`gap: ${stringify(gap)}px; max-width: ${stringify(maxColWidth)}px;`)}>`);
    if (animate) {
      $$payload.out.push("<!--[-->");
      const each_array_1 = ensure_array_like(col);
      $$payload.out.push(`<!--[-->`);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let [item, idx] = each_array_1[$$index];
        $$payload.out.push(`<div class="svelte-19n3mud"><!---->`);
        slot($$payload, $$props, "default", { idx, item }, () => {
          $$payload.out.push(`<span class="svelte-19n3mud">${escape_html(item)}</span>`);
        });
        $$payload.out.push(`<!----></div>`);
      }
      $$payload.out.push(`<!--]-->`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array_2 = ensure_array_like(col);
      $$payload.out.push(`<!--[-->`);
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let [item, idx] = each_array_2[$$index_1];
        $$payload.out.push(`<!---->`);
        slot($$payload, $$props, "default", { idx, item }, () => {
          $$payload.out.push(`<span class="svelte-19n3mud">${escape_html(item)}</span>`);
        });
        $$payload.out.push(`<!---->`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, {
    animate,
    columnClass,
    duration,
    gap,
    getId,
    idKey,
    items,
    masonryHeight,
    masonryWidth,
    maxColWidth,
    minColWidth,
    style,
    class: className
  });
  pop();
}
function PortfolioBlock($$payload, $$props) {
  push();
  let { block } = $$props;
  const projects = block.resolvedProjects ?? [];
  const config = block.portfolioBlock;
  const displayMode = config ? getDisplayMode(config) : "horizontal_scroll";
  const enableSearch = config?.enableSearch ?? false;
  const alignmentClass = block.attributes?.align === "full" ? "alignfull" : "alignwide";
  let searchTerm = "";
  let viewMode = displayMode;
  const handleServiceClick = (serviceName) => {
    if (enableSearch) {
      searchTerm = serviceName;
    }
  };
  let filteredProjects = (() => {
    if (!enableSearch || !searchTerm.trim()) {
      return projects;
    }
    const searchLower = searchTerm.toLowerCase();
    return projects.filter((project) => {
      const titleMatch = project.title?.toLowerCase().includes(searchLower);
      const excerptText = project.excerpt?.replace(/<[^>]*>/g, "") || "";
      const excerptMatch = excerptText.toLowerCase().includes(searchLower);
      const clientMatch = project.nhtblClients?.nodes?.some((client) => client?.name?.toLowerCase().includes(searchLower));
      const serviceMatch = project.nhtblServices?.nodes?.some((service) => service?.name?.toLowerCase().includes(searchLower));
      return titleMatch || excerptMatch || clientMatch || serviceMatch;
    });
  })();
  let minColWidth = 300;
  let maxColWidth = 600;
  let gap = 30;
  if (enableSearch) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div${attr_class(`portfolio-controls ${stringify(alignmentClass)} mb-8 sticky top-24 w-full z-10`, "svelte-13st3ge")}><div class="flex items-center gap-4 justify-between mb-6"><div class="relative w-full"><div class="absolute inset-y-0 z-10 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="black"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div> <input type="text"${attr("value", searchTerm)} placeholder="Search projects by title, client, service, or description..." class="w-full pl-10 pr-12 py-3 bg-white/60 rounded-full backdrop-blur-md border-none focus:outline-none transition-colors text-black font-medium placeholder-white/50"/> `);
    if (searchTerm) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="absolute inset-y-0 right-0 flex flex-row items-center"><p class="text-black/30 pr-3 text-sm">${escape_html(filteredProjects.length)} project${escape_html(filteredProjects.length !== 1 ? "s" : "")} found</p> <button class="pr-3 flex items-center text-gray-400 hover:text-white transition-colors" aria-label="Clear search"><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="black"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div> <div class="flex gap-2"><button${attr_class(`p-3 rounded-full border transition-colors ${stringify(viewMode === "list" ? "bg-white text-black border-white" : "bg-transparent text-white border-gray-600 hover:border-white")}`)} aria-label="List view"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h18m-18 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg></button> <button${attr_class(`p-3 rounded-full border transition-colors ${stringify(viewMode === "masonry" ? "bg-white text-black border-white" : "bg-transparent text-white border-gray-600 hover:border-white")}`)} aria-label="Masonry view"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="8" height="6" stroke="currentColor" stroke-width="2" fill="none"></rect><rect x="13" y="3" width="8" height="8" stroke="currentColor" stroke-width="2" fill="none"></rect><rect x="3" y="11" width="8" height="10" stroke="currentColor" stroke-width="2" fill="none"></rect><rect x="13" y="13" width="8" height="8" stroke="currentColor" stroke-width="2" fill="none"></rect></svg></button></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->  `);
  if (viewMode === "horizontal_scroll") {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(filteredProjects);
    $$payload.out.push(`<div${attr_class(`portfolio-carousel horizontal-gallery ${stringify(alignmentClass)} relative overflow-hidden`, "svelte-13st3ge")}><div class="cards-container flex gap-4 overflow-x-auto pb-4 svelte-13st3ge"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let project = each_array[$$index];
      $$payload.out.push(`<div class="flex-shrink-0 w-72 lg:w-[24rem]">`);
      FeaturedProject($$payload, {
        displayMode: "block",
        project,
        enableSearch,
        onServiceClick: handleServiceClick
      });
      $$payload.out.push(`<!----></div>`);
    }
    $$payload.out.push(`<!--]--></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (viewMode === "masonry") {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="portfolio-masonry my-16 full-width-breakout svelte-13st3ge">`);
      if (filteredProjects.length > 0) {
        $$payload.out.push("<!--[-->");
        Masonry($$payload, {
          items: filteredProjects,
          minColWidth,
          maxColWidth,
          gap,
          idKey: "slug",
          animate: true,
          children: invalid_default_snippet,
          $$slots: {
            default: ($$payload2, { item }) => {
              FeaturedProject($$payload2, {
                displayMode: "masonryBlock",
                project: item,
                enableSearch,
                onServiceClick: handleServiceClick
              });
            }
          }
        });
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`<div${attr_class(`text-center py-12 ${stringify(alignmentClass)}`, "svelte-13st3ge")}><p class="text-gray-600">No projects found.</p></div>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (viewMode === "list") {
        $$payload.out.push("<!--[-->");
        const each_array_1 = ensure_array_like(filteredProjects);
        $$payload.out.push(`<div${attr_class(`portfolio-list ${stringify(alignmentClass)} my-8`, "svelte-13st3ge")}><div class="space-y-5"><!--[-->`);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let project = each_array_1[$$index_1];
          FeaturedProject($$payload, {
            displayMode: "grid",
            project,
            enableSearch,
            onServiceClick: handleServiceClick
          });
        }
        $$payload.out.push(`<!--]--></div> `);
        if (filteredProjects.length === 0) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="text-center py-12"><p class="text-gray-600">No projects found.</p></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div>`);
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
function Carousel($$payload, $$props) {
  push();
  var $$store_subs;
  let images = $$props["images"];
  let autoplay = fallback($$props["autoplay"], false);
  let currentSlideIndex = writable(0);
  onDestroy(() => {
  });
  const each_array = ensure_array_like(images);
  $$payload.out.push(`<div class="carousel relative aspect-video svelte-e7zbyu"><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let image = each_array[index];
    if (store_get($$store_subs ??= {}, "$currentSlideIndex", currentSlideIndex) === index) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div><div class="w-full aspect-video absolute inset-0">`);
      Image$1($$payload, { imageObject: image, imageSize: "large", fit: "contain" });
      $$payload.out.push(`<!----></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div>`);
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  bind_props($$props, { images, autoplay });
  pop();
}
function GalerieBlock($$payload, $$props) {
  push();
  let block = $$props["block"];
  const images = block.galerie.galerie.nodes;
  Carousel($$payload, { autoplay: true, images });
  bind_props($$props, { block });
  pop();
}
function CoreButton($$payload, $$props) {
  push();
  let block = $$props["block"];
  const getTextClass = (fontSize) => {
    switch (fontSize) {
      case "sm":
        return "text-sm";
      case "base":
        return "text-sm md:text-base";
      case "lg":
        return "text-base md:text-lg";
      case "xl":
        return "text-base md:text-lg lg:text-xl";
      case "2xl":
        return "text-xl md:text-2xl";
      case null:
      default:
        return "text-sm md:text-base";
    }
  };
  const getBackgroundClass = (backgroundColor) => {
    return backgroundColor ? `bg-${backgroundColor}` : "bg-nhtbl-green-base";
  };
  const getBorderClass = (borderColor) => {
    return borderColor ? `border-${borderColor} border` : "border-black border";
  };
  const getTextColorClass = (textColor) => {
    return textColor ? `text-${textColor}` : "text-black";
  };
  Button($$payload, {
    textClass: getTextClass(block.attributes?.fontSize ?? null),
    colourClass: `${getBackgroundClass(block.attributes?.backgroundColor ?? null)} ${getBorderClass(block.attributes?.borderColor ?? null)}`,
    textColourClass: getTextColorClass(block.attributes?.textColor ?? null),
    url: block.attributes?.url,
    label: block.attributes?.text
  });
  bind_props($$props, { block });
  pop();
}
function CoreButtons($$payload, $$props) {
  push();
  let block = $$props["block"];
  const children = block.children;
  const bgColor = block.attributes.backgroundColor ?? "white";
  const { justifyContent } = block.attributes?.layout ?? "left";
  function justifyContentClass(justifyContent2) {
    switch (justifyContent2) {
      case "left":
        return "justify-start";
      case "center":
        return "justify-center";
      case "right":
        return "justify-end";
      case "space-between":
        return "justify-between";
      default:
        return "";
    }
  }
  const each_array = ensure_array_like(children);
  $$payload.out.push(`<div class="px-2 md:px-0"><div${attr_class(`m-auto flex ${justifyContentClass(justifyContent)} ${bgColor === "black" ? "!text-white" : ""}`)}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let block2 = each_array[index];
    CoreButton($$payload, { block: block2 });
  }
  $$payload.out.push(`<!--]--></div></div>`);
  bind_props($$props, { block });
  pop();
}
function AcfLinkBlock($$payload, $$props) {
  push();
  let block = $$props["block"];
  const children = block.children || [];
  const bgColor = block.attributes?.backgroundColor ?? "white";
  let link = block.linkBlock?.internalLink?.nodes[0].uri;
  if (!link)
    link = block.linkBlock?.externalLink?.url;
  const each_array = ensure_array_like(children);
  $$payload.out.push(`<a class="block link-block p-2 hover:bg-white hover:!text-black transition-colors duration-300 rounded-lg"${attr("href", link)}><div${attr_class(`group m-auto ${stringify(bgColor === "black" && "!text-white")} overflow-hidden`)}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let childBlock = each_array[index];
    BlockRenderer($$payload, { block: childBlock });
  }
  $$payload.out.push(`<!--]--></div></a>`);
  bind_props($$props, { block });
  pop();
}
function CoreImage($$payload, $$props) {
  push();
  let { block } = $$props;
  const imageObject = {
    altText: block.attributes?.alt ? block.attributes.alt : "",
    mediaDetails: { sizes: block.mediaDetails?.sizes ?? [] },
    contentTypeName: "attachment",
    databaseId: 0,
    id: "",
    isComment: false,
    isTermNode: false,
    slug: "",
    uri: ""
  };
  const aspectRatio = block.attributes?.aspectRatio || "auto";
  let aspectRatioClass = "";
  switch (aspectRatio) {
    case "1":
      aspectRatioClass = "aspect-square";
      break;
    case "4/3":
      aspectRatioClass = "aspect-[4/3]";
      break;
    case "3/4":
      aspectRatioClass = "aspect-[3/4]";
      break;
    case "3/2":
      aspectRatioClass = "aspect-[3/2]";
      break;
    case "16/9":
      aspectRatioClass = "aspect-[16/9]";
      break;
    case "9/16":
      aspectRatioClass = "aspect-[9/16]";
      break;
    default:
      aspectRatioClass = "aspect-auto";
  }
  $$payload.out.push(`<figure class="mb-4 w-full">`);
  Image($$payload, {
    imageObject,
    imageSize: "large",
    extraClasses: aspectRatioClass,
    fit: "cover"
  });
  $$payload.out.push(`<!----> `);
  if (block.attributes?.caption) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<figcaption class="font-inter mt-2 text-center text-sm">${escape_html(block.attributes.caption)}</figcaption>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></figure>`);
  pop();
}
function Video($$payload, $$props) {
  let {
    src,
    autoplay = false,
    controls = true,
    loop = false,
    muted = false,
    playsInline = false,
    preload = "metadata",
    extraClasses = "",
    fit = "none"
  } = $$props;
  const fitClass = fit === "cover" ? "object-cover" : fit === "contain" ? "object-contain" : fit === "fill" ? "object-fill" : "object-none";
  $$payload.out.push(`<div class="relative w-full max-w-none flex justify-center"><video${attr_class(`w-full h-full ${fitClass} ${extraClasses}`)}${attr("src", src)}${attr("autoplay", autoplay, true)}${attr("controls", controls, true)}${attr("loop", loop, true)}${attr("muted", muted, true)}${attr("preload", preload)}${attr("playsinline", playsInline, true)}>Your browser does not support the video tag.</video></div>`);
}
function CoreVideo($$payload, $$props) {
  push();
  let { block } = $$props;
  const src = block.attributes?.src || "";
  const autoplay = block.attributes?.autoplay || false;
  const controls = block.attributes?.controls !== false;
  const loop = block.attributes?.loop || false;
  const muted = block.attributes?.muted || false;
  const playsInline = block.attributes?.playsInline || false;
  const preload = block.attributes?.preload || "metadata";
  const caption = block.attributes?.caption || "";
  const align = block.attributes?.align || null;
  const alignmentClass = (() => {
    switch (align) {
      case "left":
        return "text-left";
      case "center":
        return "text-center mx-auto";
      case "right":
        return "text-right ml-auto";
      case "wide":
        return "w-full max-w-screen-lg mx-auto";
      case "full":
        return "w-full";
      default:
        return "";
    }
  })();
  $$payload.out.push(`<figure${attr_class(`mb-4 w-full ${stringify(alignmentClass)}`)}>`);
  if (src) {
    $$payload.out.push("<!--[-->");
    Video($$payload, {
      src,
      autoplay,
      controls,
      loop,
      muted,
      playsInline,
      preload,
      fit: "cover"
    });
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="bg-gray-200 flex items-center justify-center h-64 text-gray-500">No video source provided</div>`);
  }
  $$payload.out.push(`<!--]--> `);
  if (caption) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<figcaption class="font-inter mt-2 text-center text-sm">${escape_html(caption)}</figcaption>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></figure>`);
  pop();
}
function BlockRenderer($$payload, $$props) {
  push();
  let { forceFull = false, block } = $$props;
  let isInView = false;
  const align = forceFull ? "full" : block.attributes?.align || "none";
  const bgColor = block.attributes?.backgroundColor ?? "none";
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
  const spacingClasses = block.attributes?.style ? mapSpacingToTailwind(block.attributes.style) : "";
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
      case "center":
        baseClasses = "w-full max-w-[852px] mx-auto";
        break;
      case null:
        baseClasses = "w-full";
        break;
    }
    return `${baseClasses} ${spacingClasses}`;
  };
  const blockName = block.name || "";
  function hasHomePageHero(block2) {
    return "homePageHero" in block2 && block2.homePageHero !== null && block2.homePageHero !== void 0;
  }
  function hasServicePush(block2) {
    return "servicePush" in block2 && block2.servicePush !== null && block2.servicePush !== void 0;
  }
  $$payload.out.push(`<div${attr_class(`${stringify(classNames(align))} bg-${stringify(bgColor)} !px-0`)}><div${attr_class(`transition-all duration-[800ms] ease-in-out h-full ${stringify(" translate-y-2 opacity-0.2")}`)}${attr("data-inview", isInView)}>`);
  if (hasHomePageHero(block)) {
    $$payload.out.push("<!--[-->");
    HomePageHero($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (hasServicePush(block)) {
    $$payload.out.push("<!--[-->");
    ServicePush($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/group") {
    $$payload.out.push("<!--[-->");
    CoreGroup($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/buttons") {
    $$payload.out.push("<!--[-->");
    CoreButtons($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/button") {
    $$payload.out.push("<!--[-->");
    CoreButton($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/columns") {
    $$payload.out.push("<!--[-->");
    CoreColumns($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/column") {
    $$payload.out.push("<!--[-->");
    CoreColumn($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/paragraph") {
    $$payload.out.push("<!--[-->");
    CoreParagraph($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/heading") {
    $$payload.out.push("<!--[-->");
    CoreHeading($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/spacer") {
    $$payload.out.push("<!--[-->");
    CoreSpacer($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/image") {
    $$payload.out.push("<!--[-->");
    CoreImage($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "core/video") {
    $$payload.out.push("<!--[-->");
    CoreVideo($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "acf/portfolio-block") {
    $$payload.out.push("<!--[-->");
    PortfolioBlock($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "acf/galerie") {
    $$payload.out.push("<!--[-->");
    GalerieBlock($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (blockName === "acf/link-block") {
    $$payload.out.push("<!--[-->");
    AcfLinkBlock($$payload, { block });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div>`);
  pop();
}
export {
  BlockRenderer as B,
  html as h
};
