<script lang="ts">
  import Image from '$components/Image.svelte'
  import Modal from '$components/Modal.svelte' // Assume you have a Modal component for the slideshow
  import type { PortfolioItemNode, ImageSize } from '$lib/types/wp-types.ts'

  export let block:PortfolioItemNode

  let showModal:boolean = false

  const openSlideshow = () => {
    showModal = true
  }

  const getSrcSet = (sizes: ImageSize[]): string => {
  return sizes.map(({ sourceUrl, width }) => `${sourceUrl} ${width}w`).join(', ')
}

</script>

{#if block?.featuredImage?.node?.mediaDetails?.sizes}
  <div on:click={openSlideshow} on:keypress={openSlideshow} style="cursor: pointer;">
    <Image imageSize="medium_large" imageObject={block.featuredImage.node} />
  </div>
{/if}

{#if showModal}
  <Modal on:close={() => (showModal = false)}>
    <div class="flex flex-row w-full overflow-x-auto h-[50vh]">
      {#each block?.imageGallery?.imageGallery?.nodes as { mediaDetails, altText }}
        <div class="h-[50vh]">
          <img
            srcset={getSrcSet(mediaDetails.sizes)}
            sizes="(max-width: 600px) 480px, 800px"
            src={mediaDetails.sizes.find(size => size.name === 'large').sourceUrl}
            alt={altText}
            class="h-full w-auto max-w-none"
          />
        </div>
      {/each}
    </div>
    <div class="text-nhtbl-green-base">{@html block.content}</div>
  </Modal>
{/if}
