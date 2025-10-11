<script lang="ts">
  import { onMount } from 'svelte'
  // TODO: Migrate to generated AcfHomePageHero type when image types are aligned
  export let block: any
  const images = block.homePageHero.images.nodes
  const content = block.children
  
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import Image from '$components/atoms/Image.svelte'
  import { draw } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  let y: number
  let percentage: number = 100
  let stopAnimationPoint: number
  let pageHeight: number = 3000
  let stopHeight: number = 3000
  let stopped: boolean = false
  let topStart: number = 0

  let transformString: string

  let bgdiv: HTMLDivElement
  let isMounted: boolean = false

  onMount(() => {
    pageHeight = 3000 + window.innerHeight
    stopHeight = 3000 - window.innerHeight
    stopAnimationPoint = 3000
    topStart = 3000 - window.innerHeight
    isMounted = true
  })

  $: {
    percentage = 100 - (y / pageHeight) * 100
    if (y > stopHeight) {
      stopped = true
    } else stopped = false


    // Hide SVG when scrolled past the hero section (when stopped becomes true)
    if (stopped) {
      isMounted = false
    } else if (!stopped && !isMounted) {
      isMounted = true
    }

    if (!stopped) {
      transformString = `transform: scale(${percentage}%)`
    } else transformString = `transform: scale(35%); position:absolute; top:${topStart}px`
  }
</script>

<svelte:window bind:scrollY={y} />
<div class="{stopped ? 'absolute' : 'fixed top-0'} w-full !px-0 h-screen -z-10 top-0" bind:this={bgdiv} style={stopped ? `top:${topStart}px` : ''}>
  {#each images as image, index}
    {@const imageThreshold = (100 / images.length)}
    {@const imageStart = imageThreshold * index}
    {@const imageEnd = imageThreshold * (index + 1)}
    {@const shouldBeVisible = percentage >= imageStart && percentage < imageEnd}
    
    <div
      class="absolute top-0 left-0 w-full duration-1000 h-full object-cover transition-all {shouldBeVisible ? 'opacity-100' : 'opacity-0'}"
    >
      <Image imageObject={image} lazy={false} imageSize="medium" fit="cover" />
    </div>
  {/each}
</div>
<div class="h-[3000px] relative">
  <div style={transformString} class="box fixed flex h-screen w-screen items-center justify-center">
    <div class="relative h-screen w-screen bg-white my-[5wv] mx-[5wh] flex justify-center items-center p-4 md:p-8 leading-relaxed text-black">
      <div class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl box-container">
        {#each content as block}
          <BlockRenderer {block} />
        {/each}
      </div>
    </div>
  </div>
  <div class="fixed bottom-10 font-serif text-base text-center w-full flex flex-row justify-center">
    {#if isMounted}
      <svg fill="none" width="49" height="73" viewBox="0 0 49 73" xmlns="http://www.w3.org/2000/svg">
        <path
          vector-effect="non-scaling-stroke"
          transition:draw={{ delay: 1000, duration: 500, easing: quintOut }}
          class:stroke-black={percentage > 90 && percentage <= 100}
          class:stroke-nhtbl-green-base={percentage > 1 && percentage <= 90 && !stopped}
          class="stroke-[3px]"
          d="M32.88 57.21C28.01 62.25 23.14 67.3 18.27 72.34C12.05 67.64 6.09002 62.74 0.400024 57.64C0.660024 57.98 0.920024 58.32 1.17002 58.67"
          stroke-miterlimit="10"
        />
        <path
          vector-effect="non-scaling-stroke"
          transition:draw={{ delay: 0, duration: 1000, easing: quintOut }}
          class:stroke-black={percentage > 90 && percentage <= 100}
          class:stroke-nhtbl-green-base={percentage > 1 && percentage <= 90 && !stopped}
          class="stroke-[3px]"
          d="M48.6701 0.5C38.0201 0.84 28.1201 9.02 25.7701 19.41C24.8701 23.37 25.0301 27.71 27.0101 31.26C28.9901 34.81 33.0001 37.35 37.0301 36.86C41.0601 36.37 44.5301 32.31 43.7401 28.33C43.0001 24.6 39.1101 22.22 35.3301 21.75C26.1701 20.63 17.7401 28.39 15.1601 37.25C12.5801 46.11 14.5101 55.62 17.1001 64.48C17.7301 66.64 18.4101 68.9 17.9901 71.11"
          stroke-miterlimit="10"
        />
      </svg>
    {/if}
  </div>
</div>
