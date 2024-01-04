<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import type { PageData } from './$types'
  export let data: PageData
  let y: number
  let percentage: number
  let pageHeight = 0
  console.log(pageHeight)
  let box: HTMLDivElement
  console.log(data.images.length)

  onMount(() => {
    pageHeight = document.documentElement.scrollHeight - window.innerHeight
  })

  let transformString: string

  let bgdiv: HTMLDivElement

  const images = data

  $: {
    percentage = 100 - (y / pageHeight) * 100
    console.log(percentage)
    transformString = `transform: scale(${percentage}%)`
  }
</script>

<svelte:window bind:scrollY={y} />

<div class="fixed z-0 w-screen h-screen" bind:this={bgdiv}>
  {#each data.images as image, index}
    <img
      src={image}
      class="fixed top-0 left-0 w-full duration-1000 h-full object-cover transition-all {percentage <= 100 - (100 / data.images.length * index) && percentage > 100 - (100 / data.images.length * (index + 1)) ? 'opacity-100' : 'opacity-0'}"
      alt="background"
    />
  {/each}
</div>
<div class="h-[500vh]">
  <div style={transformString} class="box fixed flex h-screen w-screen items-center justify-center">
    <div class="relative h-screen w-screen bg-green my-[5wv] mx-[5wh] flex justify-center items-center p-8 leading-relaxed text-black">
      <p class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl">
        <span class="font-bold">Not here to be liked</span> is a digital-first design and strategy lab committed to change through action. We help organisations and movements use storytelling, memes and design to shift narratives and move hearts.
      </p>
      <p class="absolute bottom-20 font-serif text-base">Scroll down for context</p>
    </div>
  </div>
</div>

<style>
  .theimage {
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
  }

  .image.shothething {
    opacity: 1;
  }
</style>