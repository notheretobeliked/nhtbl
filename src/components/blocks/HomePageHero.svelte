<script lang="ts">
  import { onMount } from 'svelte'
  export let images
  export let content


  let y:number
  let percentage: number
  let stopAnimationPoint: number
  let pageHeight = 0

  const findImageSize = (sizes, name) => sizes.find(size => size.name === name)?.sourceUrl || '';


  onMount(() => {
    pageHeight = document.documentElement.scrollHeight - window.innerHeight
    stopAnimationPoint = (pageHeight - window.innerHeight) * 0.6
  })

  let transformString: string

  let bgdiv: HTMLDivElement

  $: {
    percentage = 100 - (y / pageHeight) * 100
    console.log(percentage)
    if (percentage > 60) {
      transformString = `transform: scale(${percentage}%)`
    } else {
      transformString = `transform: scale(60%); position: absolute; top:160%;`
    }
  }
</script>

<svelte:window bind:scrollY={y} />
<div class="h-[500vh]">
  <div class={percentage > 60 ? 'fixed z-0 w-screen h-screen' : 'absolute z-0 w-screen h-screen'} style={percentage < 60 ? `top: ${stopAnimationPoint}px` : ''} bind:this={bgdiv}>
    {#each images as image, index}
      <img
        src={findImageSize(image.mediaDetails.sizes, '1536x1536')}
        alt={image.alt}
        class="absolute top-0 left-0 w-full duration-1000 h-full object-cover transition-all {percentage <= 100 - (100 / images.length) * index &&
        percentage > 100 - (100 / images.length) * (index + 1)
          ? 'opacity-100'
          : 'opacity-0'}"
      />
    {/each}
  </div>

  <div style={transformString} class="box fixed flex h-screen w-screen items-center justify-center">
    <div class="relative h-screen w-screen bg-green my-[5wv] mx-[5wh] flex justify-center items-center p-8 leading-relaxed text-black">
      <div class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl box-container flex flex-col">
        {#each content as contentItem, index}
          <p class="text-{contentItem.attributes.fontSize}">{@html contentItem.attributes.content}</p>
        {/each}
      </div>
    </div>
  </div>
  <div class="fixed bottom-10 font-serif text-base text-center w-full">
    {#if percentage > 90}
      Scroll for more...
    {:else if percentage > 60}
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
