<script lang="ts">
  import type { ACFServicePush } from '$lib/types/wp-types'
  export let block: ACFServicePush
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import Image from '$components/Image.svelte'
  const imageObject = block.servicePush.service.nodes[0].featuredImage.node
  const uri = block.servicePush.service.nodes[0].uri
  
</script>

<div class="group aspect-video rotate-1 max-w-[750px] relative bg-nhtbl-green-base mb-12 transition-colors duration-300 hover:bg-nhtbl-purple-base">
  <a href="{uri}" class="block absolute inset-0">
    <div class="absolute inset-0 -z-0">
      <Image {imageObject} imageSize="medium_large" fit="cover" extraClasses="transition-transform duration-500 ease-in-out group-hover:scale-105" />
    </div>
    <div class="absolute bottom-0 left-0 w-full py-3 px-6 bg-nhtbl-green-base group-hover:bg-nhtbl-purple-base transition-colors duration-300">
      {#each block.children as block}
        <BlockRenderer {block} />
      {/each}
    </div>
  </a>
</div>
