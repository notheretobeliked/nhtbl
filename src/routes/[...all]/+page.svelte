<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte';
  import type { PageData } from './$types'
  export let data: PageData
  
  let blocks = []
  let backgroundColour: string = data.backgroundColour ?? "white"

  $: {
    blocks = data.editorBlocks
    backgroundColour = data.backgroundColour
  }



</script>

<div class="py-24 min-h-screen bg-{backgroundColour}">
  {#each blocks as block, index (block.clientId)}
  <BlockRenderer block={block} />
  {/each}
</div>
<style>

</style>
