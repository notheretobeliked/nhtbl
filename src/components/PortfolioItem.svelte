<script lang="ts">

  import { pushState, goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import PortfolioItemDetails from '$components/PortfolioItemDetails.svelte'
  import Image from '$components/Image.svelte'
  import Modal from '$components/Modal.svelte'
  import type { PortfolioItemNode, ImageSize } from '$lib/types/wp-types.ts'

  export let block: PortfolioItemNode
  export let isActive: boolean = false
  export let useHrefs: boolean = false

  let showModal: boolean = false
  let videos: HTMLVideoElement[] = []

  const openSlideshow = (event): void => {
    event.preventDefault()
    isActive =! isActive
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

{#if isActive}
  <Modal on:close={ () => isActive =! isActive }>
    <PortfolioItemDetails {block} />
  </Modal>
{/if}
