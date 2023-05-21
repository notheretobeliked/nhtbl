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
    <div class="h-screen w-screen bg-[#E3FE53] my-[5wv] mx-[5wh]"><img src="/thingy.png" alt="text" /></div>
  </div>
</div>

<style>

</style>