<script lang="ts">
  import type { ProcessedImage } from '$lib/utilities/imageExtractor'
  import type { ImageSize } from '$lib/types/wp-types'
  import { findImageSizeData, getSrcSet } from '$lib/utilities/utilities'

  interface Props {
    image: ProcessedImage | null
    isOpen: boolean
    onclose: () => void
  }

  let { image, isOpen, onclose }: Props = $props()

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
    if (e.key === 'Escape') {
      onclose()
    }
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
  <!-- Backdrop closes on click; keyboard close is handled globally via the
       svelte:window Escape handler above. -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    use:portal
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="image-modal-title"
    tabindex="-1"
  >
    <div class="relative max-w-4xl max-h-full w-full bg-white rounded-lg overflow-hidden shadow-2xl">
      <!-- Close button -->
      <button
        onclick={onclose}
        class="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
        aria-label="Close modal"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Image at its natural aspect ratio, capped to the viewport. -->
      <div class="flex items-center justify-center bg-gray-100">
        <img
          src={findImageSizeData('sourceUrl', sizes, 'large')}
          srcset={getSrcSet(sizes)}
          sizes="(max-width: 896px) 100vw, 896px"
          alt={image.altText ?? ''}
          class="max-h-[80vh] max-w-full w-auto h-auto object-contain"
        />
      </div>

      <!-- Image details -->
      <div class="p-6">
        <div class="flex text-black items-center justify-between">
          <div>
            <p class="text-sm">From project:</p>
            <p class="font-medium">{image.projectTitle}</p>
          </div>
          
          <a 
            href={image.projectUri}
            class="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
          >
            View Project
            <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="black">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Prevent body scroll when modal is open */
  :global(body:has([aria-modal="true"])) {
    overflow: hidden;
  }
</style>