<script lang="ts">
  import { onMount } from 'svelte'
  export let images
  export let content
  import BlockRenderer from '$components/BlockRenderer.svelte'

  let y: number
  let percentage: number = 100
  let stopAnimationPoint: number
  let pageHeight: number = 3000
  let stopHeight: number = 3000
  let stopped: boolean = false
  let topStart: number = 0

  const findImageSize = (sizes, name) => sizes.find(size => size.name === name)?.sourceUrl || ''

  let transformString: string

  let bgdiv: HTMLDivElement
  let scaleFactor = 1
  let transformPercentage = percentage

  onMount(() => {
    pageHeight = 3000 + window.innerHeight
    stopHeight = 3000 - window.innerHeight
    stopAnimationPoint = 3000
    topStart = 3000 - window.innerHeight
  })

  $: {
    percentage = 100 - (y / pageHeight) * 100
    if (y > stopHeight) {
      stopped = true
    } else stopped = false


    if (!stopped) {
      transformString = `transform: scale(${percentage}%)`
    } else transformString = `transform: scale(35%); position:absolute; top:${topStart}px`
  }
</script>

<svelte:window bind:scrollY={y} />
<div class="{stopped ? 'absolute' : 'fixed top-0'} w-screen h-screen -z-10 top-0" bind:this={bgdiv} style={stopped ? `top:${topStart}px` : ''}>
  {#each images as image, index}
    <img
      src={findImageSize(image.mediaDetails.sizes, 'medium_large')}
      alt={image.alt}
      class="absolute top-0 left-0 w-full duration-1000 h-full object-cover transition-all {percentage <= 100 - (100 / images.length) * index &&
      percentage > 100 - (100 / images.length) * (index + 1)
        ? 'opacity-100'
        : 'opacity-0'}"
    />
  {/each}
</div>
<div class="h-[3000px] relative">
  <div style={transformString} class="box fixed flex h-screen w-screen items-center justify-center">
    <div class="relative h-screen w-screen bg-nhtbl-green-base my-[5wv] mx-[5wh] flex justify-center items-center p-8 leading-relaxed text-black">
      <div class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl box-container flex flex-col gap-7">
        {#each content as block, index}
          <BlockRenderer {block} />
        {/each}
      </div>
    </div>
  </div>
  <div class="fixed bottom-10 font-serif text-base text-center w-full">
    {#if percentage > 90}
      Scroll for more...
    {:else if percentage > 1 && !stopped}
      <span class="text-white">Keep scrolling...</span>
    {/if}
  </div>
</div>

<style lang="postcss">
  /* purgecss start ignore */

  .box-container p {
    @apply mb-8;
  }

  .box-container p strong {
    @apply relative;
    margin-right: 5px;
  }

  .box-container p strong::after {
    background-image: url('/svgs/line.svg');
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 8px;
    background-size: cover;
  }
  /* purgecss end ignore */
</style>
