<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte';
  import type { PageData } from './$types'
  export let data: PageData
  


  const images = data.images
  const content = data.content
  const blocks = data.editorBlocks

  console.log(data)
  


</script>

<div>
  {#each blocks as block, index}
  <BlockRenderer block={block} />
  {/each}
</div>
<style>

</style>
