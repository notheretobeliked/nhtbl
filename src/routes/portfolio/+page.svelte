<script lang="ts">
  import type { PageData } from './$types'
  import type { PortfolioItemNode } from '$lib/types/wp-types.ts'
  export let data: PageData
  import PortfolioItem from '$components/PortfolioItem.svelte'
  import Masonry from 'svelte-bricks'
  let [minColWidth, maxColWidth, gap] = [400, 800, 30]
  let items: PortfolioItemNode[] = data.data.nhtblProjects.nodes
  $: items
</script>

<div class="bg-black">
  <Masonry {items} {minColWidth} {maxColWidth} {gap} idKey="slug" let:item animate>
    <PortfolioItem block={item} />
  </Masonry>
</div>
