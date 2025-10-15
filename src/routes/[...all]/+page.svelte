<script lang="ts">
  import type { EditorBlock } from '$lib/graphql/generated'
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import SurveyContainer from '$components/SurveyContainer.svelte'
  import type { PageData } from './$types'
  export let data: PageData
  $: editorBlocks = data.editorBlocks
  $: backgroundColour = data.backgroundColour
  $: uri = data.uri
  $: id = data.id
  $: hasSurvey = data.hasSurvey
  $: finalBackgroundColour = (Array.isArray(backgroundColour) ? backgroundColour[0] : backgroundColour) ?? 'white'
</script>

{#if hasSurvey}
  <SurveyContainer blocks={editorBlocks} pageId={id}>
    <div class="py-40 min-h-screen bg-{backgroundColour}">
      {#each editorBlocks as block, index (block.clientId)}
        
          <BlockRenderer {block} />
        
      {/each}
    </div>
  </SurveyContainer>
{:else}
  <div class="py-40 min-h-screen bg-{backgroundColour}">
    {#each editorBlocks as block, index (block.clientId)}
      
        <BlockRenderer {block} />
      
    {/each}
  </div>
{/if}

<style>
</style>
