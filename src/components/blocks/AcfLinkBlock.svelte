<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import type { ExtendedEditorBlock } from '$lib/types/wp-types';
  export let block: ExtendedEditorBlock
  const children = block.children || []
  const bgColor = block.attributes?.backgroundColor ?? 'white'
  let link = block.linkBlock?.internalLink?.nodes[0].uri
  if (!link) link = block.linkBlock?.externalLink?.url
  
</script>

<a class="block link-block p-2  hover:bg-white hover:!text-black transition-colors duration-300 rounded-lg" href="{link}">
  <div class="group m-auto {bgColor === 'black' && '!text-white'} overflow-hidden">
    {#each children as childBlock, index}
      <BlockRenderer block={childBlock}  />
    {/each}
  </div>
</a>

<style lang="postcss">
  :global(.link-block img) {
    @apply transition-all duration-300;
  }
  
  :global(.link-block .group:hover img) {
    @apply scale-110;
  }
</style>