<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  import Image from '$components/Image.svelte'
  import Modal from '$components/Modal.svelte' // Assume you have a Modal component for the slideshow
  import type { PortfolioItemNode, ImageSize, MediaNode } from '$lib/types/wp-types.ts'

  export let block: PortfolioItemNode
  export let isActive: boolean = false
  export let useHrefs: boolean = false

  let showModal: boolean = false
  let videos: HTMLVideoElement[] = []

  const openSlideshow = (event): void => {
    event.preventDefault

    showModal = true
  }

  const getSrcSet = (sizes: ImageSize[]): string => {
    return sizes.map(({ sourceUrl, width }) => `${sourceUrl} ${width}w`).join(', ')
  }
  onMount(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log('hit')
            entry.target.play()
          } else {
            entry.target.pause()
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      },
    )

    videos.forEach(video => observer.observe(video))

    return () => {
      observer.disconnect()
    }
  })
</script>

{#if block?.featuredImage?.node?.mediaDetails?.sizes}
  <a href={block.uri} on:click={openSlideshow} on:keypress={openSlideshow}>
    <div style="cursor: pointer;">
      <Image imageSize="medium_large" imageObject={block.featuredImage.node} fit="contain" />
    </div>
  </a>
{/if}

{#if $page.state.showModal || isActive}
  <Modal on:close={() => (useHrefs ? (location.href = '/portfolio') : (showModal = !showModal))}>
    <h3 class="text-nhtbl-green-base text-center font-display mb-2">{@html block.title}</h3>
    <div class="flex flex-row w-full overflow-x-auto h-[80vh] gap-4">
      {#each block?.imageGallery?.imageGallery?.nodes || [] as mediaNode}
        {#if mediaNode.mediaType === 'image'}
          <img
            srcset={getSrcSet(mediaNode.mediaDetails.sizes)}
            sizes="(max-width: 600px) 480px, 800px"
            src={mediaNode.mediaDetails.sizes?.find(size => size.name === 'large')?.sourceUrl ?? 'fallbackImageUrl'}
            alt={mediaNode.altText}
            class="h-full w-auto max-w-none"
          />
        {:else if mediaNode.mediaType === 'file' && mediaNode.mimeType === 'video/mp4'}
          <video bind:this={videos[videos.push() - 1]} controls loop muted class="h-full w-auto max-w-none">
            <source src={mediaNode.mediaItemUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        {/if}
      {/each}
    </div>
    <div class="text-nhtbl-green-base mt-1">{@html block.content}</div>
  </Modal>
{/if}
