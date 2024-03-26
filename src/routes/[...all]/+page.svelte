<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte';
  import type { PageData } from './$types'
  export let data: PageData
  let blocks = []

  $: blocks = data.editorBlocks

  console.log(data)


</script>

<div>
  {#each blocks as block, index (block.clientId)}
  <BlockRenderer block={block} />
  {/each}
</div>
<style>

</style>
