<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte';
  import type { PageData } from './$types'
  import type { EditorBlock } from '$lib/types/wp-types.ts'
  export let data: PageData
  let blocks: EditorBlock[] = data.editorBlocks as EditorBlock[];
  console.log(blocks)

  $: {
    blocks
  }
  
  

</script>

<div>
  {#each blocks as block, index (block.clientId)}
  <BlockRenderer block={block} key={index}/>
  {/each}
</div>
<style>

</style>
