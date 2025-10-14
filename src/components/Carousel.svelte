<!-- Carousel.svelte -->
<script lang="ts">
  import type { ImageObject } from '$lib/types/wp-types.ts'
  import { onMount, onDestroy } from 'svelte'
  import { fade } from 'svelte/transition';
  import Image from '$components/atoms/Image.svelte'

  interface Props {
    images: ImageObject[] // Use appropriate type based on your TypeScript definitions
    autoplay?: boolean
  }

  let { images, autoplay = false }: Props = $props()

  let currentSlideIndex = $state(0)
  let interval: ReturnType<typeof setInterval>

  onMount(() => {
    if (autoplay) {
      interval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % images.length
      }, 3000) // Change slides every 3 seconds
    }
  })

  onDestroy(() => {
    if (interval) clearInterval(interval)
  })
</script>

<div class="carousel relative aspect-video">
    {#each images as image, index (image.mediaDetails.sizes[0].sourceUrl)}
      {#if currentSlideIndex === index}
        <div in:fade|global={{ duration: 500 }} out:fade|global={{ duration: 500 }}>
          <div class="w-full aspect-video absolute inset-0">
            <Image imageObject={image} imageSize="large" fit="contain" />
          </div>
        </div>
      {/if}
    {/each}
  </div>
  
<style>
  .carousel {
    /* Add styles for your carousel here */
    position: relative;
    width: 100%; /* Example width */
    height: auto; /* Example height, adjust as needed */
  }
</style>
