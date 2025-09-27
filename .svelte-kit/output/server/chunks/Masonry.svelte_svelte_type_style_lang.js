import { c as create_ssr_component, a as add_attribute, d as each, h as createEventDispatcher, e as escape } from "./ssr.js";
import "./client2.js";
const PortfolioItemDetails = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { block } = $$props;
  let videos = [];
  let scrollContainer;
  const getSrcSet = (sizes) => {
    return sizes.map(({ sourceUrl, width }) => `${sourceUrl} ${width}w`).join(", ");
  };
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  return `<h3 class="text-nhtbl-green-base text-center font-display mb-2"><!-- HTML_TAG_START -->${block.title}<!-- HTML_TAG_END --></h3> ${block.projectData.imageGallery.nodes.length > 1 ? `<div class="${["fixed top-1/2 left-3 invisible md:visible", "hidden"].join(" ").trim()}"><button data-svelte-h="svelte-623w14"><svg width="25" height="40" class="rotate-180" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.300049 0.400024C8.04005 6.23002 15.7901 12.06 23.5301 17.89C16.3801 25.39 8.91005 32.58 1.15005 39.44C1.67005 39.13 2.19005 38.82 2.71005 38.51" class="stroke-nhtbl-green-base fill-none stroke-[3px]" stroke-miterlimit="10"></path></svg></button></div> <div class="${[
    "fixed top-1/2 right-3 invisible md:visible",
    "hidden"
  ].join(" ").trim()}"><button data-svelte-h="svelte-flovkh"><svg width="25" height="40" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.300049 0.400024C8.04005 6.23002 15.7901 12.06 23.5301 17.89C16.3801 25.39 8.91005 32.58 1.15005 39.44C1.67005 39.13 2.19005 38.82 2.71005 38.51" class="stroke-nhtbl-green-base fill-none stroke-[3px]" stroke-miterlimit="10"></path></svg></button></div>` : ``} <div class="flex flex-row w-full overflow-x-auto h-[60vh] first-letter:md:h-[80vh] gap-3 md:gap-8"${add_attribute("this", scrollContainer, 0)}>${each(block.projectData.imageGallery.nodes || [], (mediaNode) => {
    return `${mediaNode.mediaType === "image" ? `<img${add_attribute("srcset", getSrcSet(mediaNode.mediaDetails.sizes), 0)} sizes="(max-width: 600px) 480px, 800px"${add_attribute("src", mediaNode.mediaDetails.sizes?.find((size) => size.name === "large")?.sourceUrl ?? "fallbackImageUrl", 0)}${add_attribute("alt", mediaNode.altText, 0)} class="h-full w-auto max-w-none">` : `${mediaNode.mediaType === "file" && mediaNode.mimeType === "video/mp4" ? `<video controls loop muted class="h-full w-auto max-w-none"${add_attribute("this", videos[videos.push() - 1], 0)}><source${add_attribute("src", mediaNode.mediaItemUrl, 0)} type="video/mp4">
        Your browser does not support the video tag.
      </video>` : ``}`}`;
  })}</div> <div class="text-nhtbl-green-base mt-1"><!-- HTML_TAG_START -->${block.content}<!-- HTML_TAG_END --></div>`;
});
let showButton = true;
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  return `<div class="fixed flex inset-0 p-4 lg:p-12 justify-center items-center z-40 w-full h-full bg-black backdrop-blur-lg bg-opacity-40"><button class="${"w-12 h-12 fixed inset-4 border-none bg-transparent text-xl cursor-pointer text-nhtbl-green-base z-50 " + escape(showButton, true)}"><svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1583_784)"><path d="M2.94999 44.6399C16.65 31.0399 29.95 17.0399 42.83 2.65995C44.11 1.22995 42 -0.900052 40.71 0.539948C27.83 14.9199 14.53 28.9199 0.829994 42.5199C-0.540006 43.8799 1.57999 45.9999 2.94999 44.6399Z" class="fill-nhtbl-green-base"></path><path d="M1.77999 3.71003C15.38 17.41 29.38 30.71 43.76 43.59C45.19 44.87 47.32 42.76 45.88 41.47C31.5 28.59 17.5 15.29 3.89999 1.59003C2.53999 0.220034 0.419987 2.34003 1.77999 3.71003Z" class="fill-nhtbl-green-base"></path></g><defs><clipPath id="clip0_1583_784"><rect width="47.3" height="45.27" fill="white"></rect></clipPath></defs></svg></button> <div class="rounded max-h-80vh relative max-w-full w-full">${slots.default ? slots.default({}) : ``}</div></div>`;
});
export {
  Modal as M,
  PortfolioItemDetails as P
};
