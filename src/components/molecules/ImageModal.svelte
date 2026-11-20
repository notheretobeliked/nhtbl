<script lang="ts">
  import type { ProcessedImage } from '$lib/utilities/imageExtractor'
  import type { ImageSize } from '$lib/types/wp-types'
  import { findImageSizeData, getSrcSet } from '$lib/utilities/utilities'

  interface Props {
    image: ProcessedImage | null
    isOpen: boolean
    onclose: () => void
    /** Step to the previous / next image. The arrows are hidden when absent. */
    onprev?: () => void
    onnext?: () => void
    /** "12 / 278" counter, shown when both are given. */
    position?: number
    total?: number
  }

  let { image, isOpen, onclose, onprev, onnext, position = 0, total = 0 }: Props = $props()

  // Normalise the ProcessedImage sizes for findImageSizeData / getSrcSet.
  let sizes = $derived<ImageSize[]>(
    (image?.mediaDetails?.sizes ?? []).map((s: any) => ({
      name: s?.name ?? '',
      sourceUrl: s?.sourceUrl ?? '',
      width: parseInt(String(s?.width ?? '0')),
      height: parseInt(String(s?.height ?? '0'))
    }))
  )

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onclose()
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (!isOpen) return
    if (e.key === 'Escape') onclose()
    else if (e.key === 'ArrowLeft') onprev?.()
    else if (e.key === 'ArrowRight') onnext?.()
  }

  // Render the overlay at <body> so position:fixed is relative to the viewport.
  // BlockRenderer's .block-reveal wrapper keeps a transform, which would
  // otherwise become the containing block and push the modal down the page.
  function portal(node: HTMLElement) {
    document.body.appendChild(node)
    return {
      destroy() {
        node.remove()
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && image}
  <!-- A plain full-screen viewer: the image on black, a caption bar saying which
       project it's from, and a close button. The backdrop closes on click;
       keyboard close is handled globally via the svelte:window Escape handler. -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    use:portal
    class="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-label="Image from {image.projectTitle}"
    tabindex="-1"
  >
    <button
      onclick={onclose}
      class="absolute right-4 top-4 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-nhtbl-green-base text-black transition-[filter] duration-200 hover:brightness-95"
      aria-label="Close image"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    {#snippet arrow(label: string, side: string, path: string, action: () => void)}
      <button
        onclick={action}
        class="absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-nhtbl-green-base text-black transition-[filter] duration-200 hover:brightness-95 {side}"
        aria-label={label}
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
        </svg>
      </button>
    {/snippet}
    {#if onprev}
      {@render arrow('Previous image', 'left-4', 'M15 19l-7-7 7-7', onprev)}
    {/if}
    {#if onnext}
      {@render arrow('Next image', 'right-4', 'M9 5l7 7-7 7', onnext)}
    {/if}

    <!-- Image at its natural aspect ratio, as large as the space allows. The
         key makes each image fade in fresh instead of the old one lingering
         while the next loads. -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 pt-20 md:px-24 md:py-8" onclick={handleBackdropClick}>
      {#key image.id}
      <img
        src={findImageSizeData('sourceUrl', sizes, 'large')}
        srcset={getSrcSet(sizes)}
        sizes="100vw"
        alt={image.altText ?? ''}
        class="modal-image max-h-full max-w-full h-auto w-auto object-contain"
      />
      {/key}
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 px-4 pb-4 md:px-8 md:pb-6">
      <p class="m-0 font-display text-base md:text-lg">
        <span class="font-sans text-sm text-white/60">From</span>
        {image.projectTitle}
        {#if position > 0 && total > 1}
          <span class="ml-3 font-sans text-sm text-white/60">{position} / {total}</span>
        {/if}
      </p>
      <a
        href={image.projectUri}
        class="flex h-12 items-center whitespace-nowrap rounded-full bg-nhtbl-green-base px-5 font-sans text-base text-black transition-[filter] duration-200 hover:brightness-95"
      >
        View project
      </a>
    </div>
  </div>
{/if}

<style>
  .modal-image {
    animation: modal-image-in 180ms ease-out;
  }
  @keyframes modal-image-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .modal-image {
      animation: none;
    }
  }

  /* Prevent body scroll when modal is open */
  :global(body:has([aria-modal="true"])) {
    overflow: hidden;
  }
</style>