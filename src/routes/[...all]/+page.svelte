<script lang="ts">
  import type { EditorBlock } from '$lib/types/wp-types'
  import BlockRenderer from '$components/BlockRenderer.svelte';
  import type { PageData } from './$types'
  export let data: PageData
  let editorBlocks:EditorBlock[], backgroundColour:string, uri:string
  
  console.log(data)

  $: {
    ({editorBlocks, backgroundColour, uri } = data)
    backgroundColour = backgroundColour ?? "white"
  }

  



</script>
<div class="py-24 min-h-screen bg-{backgroundColour}">
  {#each editorBlocks as block, index (block.clientId)}
  <BlockRenderer block={block} />
  {/each}
</div>


<style>

</style>
