<script lang="ts">
  import { scale } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import { onMount } from 'svelte'
  import PortfolioItemDetails from '$components/PortfolioItemDetails.svelte'
  import Image from '$components/Image.svelte'
  import Modal from '$components/Modal.svelte'
  import type { PortfolioItemNode, ImageSize } from '$lib/types/wp-types.ts'

  export let block: PortfolioItemNode
  export let isActive: boolean = false
  export let useHrefs: boolean = false
  export let noLink: boolean = false

  let isHover: boolean = false
  let showModal: boolean = false
  let videos: HTMLVideoElement[] = []

  const openSlideshow = (event): void => {
    event.preventDefault()
    if (!noLink) isActive = !isActive
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
    <div class="cursor-pointer relative" on:mouseenter={() =>isHover =! isHover} on:mouseleave={() =>isHover =! isHover}>
      <Image imageSize="medium_large" imageObject={block.featuredImage.node} fit="contain" />
      {#if isHover && !noLink }
      <div
      transition:scale={{ duration: 300, opacity: 0.5, easing: quintOut }} class="bg-nhtbl-green-base p-3 bg-opacity-90 absolute inset-0 flex content-center items-center">
          <p class="text-black text-xl font-display text-center w-full">{block.title}</p>
        </div>
      {/if}
    </div>
  </a>
{/if}

{#if isActive}
  <Modal on:close={() => (isActive = !isActive)}>
    <PortfolioItemDetails {block} />
  </Modal>
{/if}
