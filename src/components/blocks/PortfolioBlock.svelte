<script lang="ts">
  export let block: EditorBlock
  import PortfolioItem from '$components/PortfolioItem.svelte'
  const projects = block.portfolioBlock.portfolioItems.nodes
</script>

<ul class="grid grid-cols-2 lg:grid-cols-3 bg-black min-h-screen">
  {#each projects as project}
    <li><PortfolioItem data={project} /></li>
  {/each}
</ul>
