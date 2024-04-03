<!-- Carousel.svelte -->
<script lang="ts">
  import type { ImageObject } from '$lib/types/wp-types.ts'
  import { onMount, onDestroy } from 'svelte'
  import { fade } from 'svelte/transition';
  import { writable } from 'svelte/store'
  import Image from './Image.svelte'

  export let images: ImageObject[] // Use appropriate type based on your TypeScript definitions
  export let autoplay: boolean = false

  let currentSlideIndex = writable(0)
  let interval: ReturnType<typeof setInterval>

  onMount(() => {
    if (autoplay) {
      interval = setInterval(() => {
        currentSlideIndex.update(n => (n + 1) % images.length)
      }, 3000) // Change slides every 3 seconds
    }
  })

  onDestroy(() => {
    if (interval) clearInterval(interval)
  })
</script>

<div class="carousel relative aspect-video">
    {#each images as image, index (image.mediaDetails.sizes[0].sourceUrl)}
      {#if $currentSlideIndex === index}
        <div in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
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
