<script lang="ts">

import { page } from '$app/stores';
  $: currentPagePath = $page.url.pathname;


  import { onMount, onDestroy } from 'svelte';
  import type { PageData } from './$types'
  import type { PortfolioItemNode } from '$lib/types/wp-types.ts'
  export let data: PageData
  import PortfolioItem from '$components/PortfolioItem.svelte'
  import Masonry from 'svelte-bricks'
  let items: PortfolioItemNode[] = data.data.nhtblProjects.nodes
  
  let minColWidth = 140; // Default value for mobile screens
  let maxColWidth = 1200;
  let gap = 30;

  // Reactive statement to update minColWidth based on window width
  $: {
    if (typeof window !== 'undefined') {
      minColWidth = window.innerWidth >= 768 ? 420 : 140; // 768px is a common breakpoint for iPads
    }
  }

  // Resize listener to react to window size changes
  onMount(() => {
    const handleResize = () => {
      minColWidth = window.innerWidth >= 768 ? 420 : 140;
    };

    window.addEventListener('resize', handleResize);

    // Cleanup to remove event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  $: items
  console.log(data)
</script>

<div class="bg-black">
  <Masonry {items} {minColWidth} {maxColWidth} {gap} idKey="slug" let:item animate>
    <PortfolioItem block={item} isActive={item.uri === currentPagePath} useHrefs />
  </Masonry>
</div>
