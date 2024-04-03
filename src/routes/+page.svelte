<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte';
  import type { PageData } from './$types'
  import type { EditorBlock } from '$lib/types/wp-types.ts'
  export let data: PageData
  let blocks: EditorBlock[] = data.editorBlocks as EditorBlock[];

  $: {
    blocks
  }
  
  

</script>

<main class="main w-full overflow-x-hidden">
  {#each blocks as block, index (block.clientId)}
    <BlockRenderer block={block} />
  {/each}
</main>

<style lang="postcss">

</style>
