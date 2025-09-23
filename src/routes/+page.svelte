<script lang="ts">
  import type { EditorBlock } from '$lib/graphql/generated'
  import BlockRenderer from '$components/BlockRenderer.svelte';
  import type { PageData } from './$types'
  export let data: PageData
  let editorBlocks:EditorBlock[], backgroundColour:string, uri:string

  $: {
    ({editorBlocks, backgroundColour, uri } = data)
    backgroundColour = backgroundColour ?? "white"
  }
</script>

<div class="main w-full overflow-x-hidden">
  {#each editorBlocks as block, index (block.clientId)}
    <BlockRenderer block={block} />
  {/each}
</div>

<style lang="postcss">

</style>
