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

<!-- overflow-x-clip (not -hidden) hides horizontal overflow without creating a
     scroll container, which would otherwise break position:sticky descendants
     such as the HomePageHero's pinned scroll region. -->
<div class="main w-full overflow-x-clip">
  {#each editorBlocks as block, index (block.clientId)}
    <BlockRenderer block={block} />
  {/each}
</div>

<style lang="postcss">

</style>
