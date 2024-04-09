<script lang="ts">
  import { pushState } from '$app/navigation'
  import { onMount } from 'svelte'
  import type { PortfolioItemNode, ImageSize } from '$lib/types/wp-types.ts'

  export let block: PortfolioItemNode
  let videos: HTMLVideoElement[] = []

  const openSlideshow = (event): void => {
    event.preventDefault()

    pushState('', { showModal: true }) // Using pushState for shallow routing
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

<h3 class="text-nhtbl-green-base text-center font-display mb-2">{@html block.title}</h3>
<div class="flex flex-row w-full overflow-x-auto h-[80vh] gap-4">
  {#each block.imageGallery.imageGallery.nodes || [] as mediaNode}
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
