<script lang="ts">
  import { onMount } from 'svelte'
  import type { ACFHomePageHero } from '$lib/types/wp-types'
  export let block: ACFHomePageHero
  const images = block.homePageHero.images.nodes
  const content = block.children
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import Image from '$components/Image.svelte'

  let y: number
  let percentage: number = 100
  let stopAnimationPoint: number
  let pageHeight: number = 3000
  let stopHeight: number = 3000
  let stopped: boolean = false
  let topStart: number = 0

  let transformString: string

  let bgdiv: HTMLDivElement

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
<div class="{stopped ? 'absolute' : 'fixed top-0'} w-full !px-0 h-screen -z-10 top-0" bind:this={bgdiv} style={stopped ? `top:${topStart}px` : ''}>
  {#each images as image, index}
    <div
      class="absolute top-0 left-0 w-full duration-1000 h-full object-cover transition-all {percentage <= 100 - (100 / images.length) * index &&
      percentage > 100 - (100 / images.length) * (index + 1)
        ? 'opacity-100'
        : 'opacity-0'}"
    >
      <Image imageObject={image} lazy={false} imageSize="medium" fit="cover" />
    </div>
  {/each}
</div>
<div class="h-[3000px] relative">
  <div style={transformString} class="box fixed flex h-screen w-screen items-center justify-center">
    <div class="relative h-screen w-screen bg-nhtbl-green-base my-[5wv] mx-[5wh] flex justify-center items-center p-4 md:p-8 leading-relaxed text-black">
      <div class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl box-container">
        {#each content as block}
          <BlockRenderer {block} />
        {/each}
      </div>
    </div>
  </div>
  <div class="fixed bottom-10 font-serif text-base text-center w-full flex flex-row justify-center">
    {#if percentage > 90}
    <svg width="89" height="110" viewBox="0 0 89 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        class="fill-black"
        d="M41.4663 82.429L22.9663 106.999L25.3163 106.699C17.383 99.1324 9.78297 91.2423 2.5163 83.029C1.2363 81.579 -0.883697 83.709 0.396303 85.149C7.66297 93.3623 15.263 101.252 23.1963 108.819C23.3609 108.977 23.5588 109.096 23.7753 109.167C23.9919 109.239 24.2217 109.261 24.4479 109.232C24.6741 109.203 24.891 109.125 25.0828 109.001C25.2746 108.878 25.4364 108.713 25.5563 108.519L44.0563 83.9391C45.2163 82.3991 42.6163 80.939 41.4663 82.429Z"
      />
      <path
      class="fill-black"
        d="M86.8163 0.16907C71.4863 -1.32093 55.8163 7.16909 48.1963 20.4391C43.9063 27.9391 41.7963 37.6491 45.1963 45.8891C48.1063 52.9691 55.5363 58.6991 63.4663 57.2891C70.8763 55.9691 76.8863 48.1491 74.0663 40.6691C71.2463 33.1891 62.8563 29.6691 55.4063 29.8291C47.3063 30.0091 39.7663 33.9991 33.7463 39.1791C27.9025 44.0729 23.3694 50.3449 20.5563 57.4291C18.2063 63.6991 18.4663 70.429 19.4363 76.899C20.1263 81.489 21.3363 85.9791 22.0663 90.5591C22.6041 94.2934 22.7783 98.0711 22.5863 101.839C22.5363 103.059 22.4763 104.289 22.4963 105.519C22.4963 107.439 25.4963 107.449 25.4963 105.519C25.4363 102.989 25.6863 100.449 25.6563 97.9191C25.5937 93.9273 25.1179 89.9528 24.2363 86.0591C22.7363 79.2191 21.1663 72.0591 21.8463 65.0591C22.4063 59.1791 25.1263 53.8191 28.5863 49.0591C32.9665 42.9798 38.862 38.1531 45.6863 35.0591C52.1263 32.2891 59.8663 31.7691 65.9863 35.6291C68.7663 37.3791 71.1963 40.1091 71.6963 43.4691C71.8574 45.0948 71.597 46.7345 70.9401 48.2304C70.2833 49.7262 69.2522 51.0276 67.9463 52.0091C62.1263 56.7191 54.2563 54.0791 50.0763 48.5391C45.0763 41.9291 45.9263 32.7091 49.0163 25.4891C54.4863 12.7091 67.7863 3.68906 81.6263 3.03906C83.3574 2.96048 85.0919 3.00728 86.8163 3.17908C88.7463 3.35908 88.7263 0.359079 86.8163 0.179079V0.16907Z"
      />
    </svg>
    {:else if percentage > 1 && !stopped}
      <span class="text-white">
        <svg width="89" height="110" viewBox="0 0 89 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            class="fill-nhtbl-green-base"
            d="M41.4663 82.429L22.9663 106.999L25.3163 106.699C17.383 99.1324 9.78297 91.2423 2.5163 83.029C1.2363 81.579 -0.883697 83.709 0.396303 85.149C7.66297 93.3623 15.263 101.252 23.1963 108.819C23.3609 108.977 23.5588 109.096 23.7753 109.167C23.9919 109.239 24.2217 109.261 24.4479 109.232C24.6741 109.203 24.891 109.125 25.0828 109.001C25.2746 108.878 25.4364 108.713 25.5563 108.519L44.0563 83.9391C45.2163 82.3991 42.6163 80.939 41.4663 82.429Z"
          />
          <path
          class="fill-nhtbl-green-base"
            d="M86.8163 0.16907C71.4863 -1.32093 55.8163 7.16909 48.1963 20.4391C43.9063 27.9391 41.7963 37.6491 45.1963 45.8891C48.1063 52.9691 55.5363 58.6991 63.4663 57.2891C70.8763 55.9691 76.8863 48.1491 74.0663 40.6691C71.2463 33.1891 62.8563 29.6691 55.4063 29.8291C47.3063 30.0091 39.7663 33.9991 33.7463 39.1791C27.9025 44.0729 23.3694 50.3449 20.5563 57.4291C18.2063 63.6991 18.4663 70.429 19.4363 76.899C20.1263 81.489 21.3363 85.9791 22.0663 90.5591C22.6041 94.2934 22.7783 98.0711 22.5863 101.839C22.5363 103.059 22.4763 104.289 22.4963 105.519C22.4963 107.439 25.4963 107.449 25.4963 105.519C25.4363 102.989 25.6863 100.449 25.6563 97.9191C25.5937 93.9273 25.1179 89.9528 24.2363 86.0591C22.7363 79.2191 21.1663 72.0591 21.8463 65.0591C22.4063 59.1791 25.1263 53.8191 28.5863 49.0591C32.9665 42.9798 38.862 38.1531 45.6863 35.0591C52.1263 32.2891 59.8663 31.7691 65.9863 35.6291C68.7663 37.3791 71.1963 40.1091 71.6963 43.4691C71.8574 45.0948 71.597 46.7345 70.9401 48.2304C70.2833 49.7262 69.2522 51.0276 67.9463 52.0091C62.1263 56.7191 54.2563 54.0791 50.0763 48.5391C45.0763 41.9291 45.9263 32.7091 49.0163 25.4891C54.4863 12.7091 67.7863 3.68906 81.6263 3.03906C83.3574 2.96048 85.0919 3.00728 86.8163 3.17908C88.7463 3.35908 88.7263 0.359079 86.8163 0.179079V0.16907Z"
          />
        </svg>
      </span>
    {/if}
  </div>
</div>
