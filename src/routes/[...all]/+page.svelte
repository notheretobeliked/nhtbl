<script lang="ts">
  import type { EditorBlock } from '$lib/graphql/generated'
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import type { PageData } from './$types'
  export let data: PageData
  let editorBlocks: EditorBlock[], backgroundColour: string, uri: string
  $: {
    ;({ editorBlocks, backgroundColour, uri } = data)
    backgroundColour = backgroundColour ?? 'white'
  }
  console.log(data.editorBlocks)
</script>

<div class="py-40 min-h-screen bg-{backgroundColour}">
  {#each editorBlocks as block, index (block.clientId)}
    
      <BlockRenderer {block} />
    
  {/each}
</div>

<style>
</style>
