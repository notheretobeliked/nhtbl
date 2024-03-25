<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData
  import PortfolioItem from '$components/PortfolioItem.svelte';
  const projects = data.data.nhtblProjects.nodes
  console.log(projects)
  
</script>

<ul class="grid grid-cols-2 lg:grid-cols-3 bg-black min-h-screen">
{#each projects as project}
<li><PortfolioItem data={project} /></li>
{/each}
</ul>
