<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte'
  export let block: EditorBlock
  const children = block.children
  const bgColor = block.attributes.backgroundColor ?? 'white'
</script>

<div class="bg-{bgColor} px-16 py-16">
<div class="m-auto {bgColor === 'black' && '!text-white'}">
  {#each children as block, index}
    <BlockRenderer {block} />
  {/each}
</div>
</div>

