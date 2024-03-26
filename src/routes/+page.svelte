<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte';
  import type { PageData } from './$types'
  export let data: PageData
  let blocks = []

  $: {
    blocks = data.editorBlocks
    data = data
  }
  


</script>

<div>
  {#each blocks as block, index}
  <BlockRenderer block={block} />
  {/each}
</div>
<style>

</style>
