<script lang="ts">
  import Image from '$components/atoms/Image.svelte'
  import type { ProcessedImage } from '$lib/utilities/imageExtractor'

  interface Props {
    image: ProcessedImage | null
    isOpen: boolean
    onclose: () => void
  }

  let { image, isOpen, onclose }: Props = $props()

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
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && image}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="image-modal-title"
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

      <!-- Image -->
      <div class="aspect-video bg-gray-100">
        <Image 
          imageObject={image} 
          imageSize="large" 
          fit="contain" 
          lazy={false}
          extraClasses="w-full h-full object-contain"
        />
      </div>

      <!-- Image details -->
      <div class="p-6">
        <h3 id="image-modal-title" class="text-lg font-semibold mb-2">
          {image.altText || 'Image'}
        </h3>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">From project:</p>
            <p class="font-medium">{image.projectTitle}</p>
          </div>
          
          <a 
            href={image.projectUri}
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            View Project
            <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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