<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  
  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()
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
