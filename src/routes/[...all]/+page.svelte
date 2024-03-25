<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte';
  import type { PageData } from './$types'
  export let data: PageData
  const blocks = data.editorBlocks
  


</script>

<div>
  {#each blocks as block, index}
  <BlockRenderer block={block} />
  {/each}
</div>
<style>

</style>
