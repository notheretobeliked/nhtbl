<script lang="ts">
  import { onMount } from 'svelte'
  let y: number
  let percentage: number
  let pageHeight = 0
  console.log(pageHeight)
  let box: HTMLDivElement

  onMount(() => {
    pageHeight = document.documentElement.scrollHeight - window.innerHeight
  })

  let transformString: string

  $: {
    percentage = 100-((y / pageHeight)*100)
    console.log(percentage)
    transformString = `transform: scale(${percentage}%)`
  }
</script>

<svelte:window bind:scrollY={y} />

<div class="fixed z-0 w-screen h-screen">
  <img src="/bg.jpg" class="w-full h-full object-cover" alt="background"/>
</div>
<div class="h-[2000vh]">
  <div style={transformString} class="box fixed flex h-screen w-screen items-center justify-center">
    <div class="relative h-screen w-screen bg-green my-[5wv] mx-[5wh] flex justify-center items-center p-8 leading-relaxed text-black">
      <p class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl"><span class="font-display">Not here to be liked</span> is a creative lab designing for change. We help movements and organisations that strive for positive change articulate difficult messages and find new audiences. We are honest about the scale of the societal crises we are all living through and believe that everyone must play their part if we are going to thrive.</p>
      <p class="absolute bottom-20 font-serif text-base">Scroll down for context</p>
    </div>
  </div>
</div>

<style>

</style>