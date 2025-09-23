<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import type { AcfLinkBlock } from '$lib/graphql/generated';
  import type { WithChildren } from '$lib/types/wp-types';
  export let block: WithChildren<AcfLinkBlock>
  const children = block.children || []
  const bgColor = block.attributes?.backgroundColor ?? 'white'
  let link = block.linkBlock?.internalLink?.nodes[0].uri
  if (!link) link = block.linkBlock?.externalLink?.url
  
</script>

<a class="block" href="{link}">
  <div class="m-auto {bgColor === 'black' && '!text-white'}">
    {#each children as childBlock, index}
      <BlockRenderer block={childBlock}  />
    {/each}
  </div>
</a>
