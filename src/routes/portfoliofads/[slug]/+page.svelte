<script lang="ts">
  import { goto, pushState } from '$app/navigation'
  import { page } from '$app/stores'
  $: currentPagePath = $page.url.pathname

  import PortfolioItemDetails from '$components/PortfolioItemDetails.svelte'
  import Modal from '$components/Modal.svelte'
  import { onMount, onDestroy } from 'svelte'
  import type { PageData } from './$types'
  import type { PortfolioItemNode } from '$lib/types/wp-types'
  export let data: PageData
  import PortfolioItem from '$components/PortfolioItem.svelte'
  import Masonry from 'svelte-bricks'

  let items: PortfolioItemNode[] = data.data.nhtblProjects.nodes

  let minColWidth = 140 // Default value for mobile screens
  let maxColWidth = 1200
  let gap = 30

  // Reactive statement to update minColWidth based on window width
  $: {
    if (typeof window !== 'undefined') {
      minColWidth = window.innerWidth >= 768 ? 420 : 140 // 768px is a common breakpoint for iPads
    }
  }

  // Resize listener to react to window size changes
  onMount(() => {
    const handleResize = () => {
      minColWidth = window.innerWidth >= 768 ? 420 : 140
    }

    window.addEventListener('resize', handleResize)

    // Cleanup to remove event listener
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  $: items
</script>

<div class="bg-black">
  {#each items as block}
    {#if block.uri === currentPagePath}
      <Modal onclose={() => pushState('/portfolio', { showModal: false, slug: null })}>
        <PortfolioItemDetails {block} />
      </Modal>
    {/if}
  {/each}
</div>
