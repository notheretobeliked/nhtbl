<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  export let block: ExtendedEditorBlock
  const children = block.children || []
  const bgColor = block.attributes?.backgroundColor ?? 'white'
</script>

<div class="px-2 md:px-0">
  <div class="m-auto {bgColor === 'black' && '!text-white'}">
    {#each children as block, index}
      <BlockRenderer {block}  />
    {/each}
  </div>
</div>
