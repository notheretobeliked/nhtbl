<script lang="ts">
  export let block: EditorBlock
  import PortfolioItem from '$components/PortfolioItem.svelte'
  import type { PortfolioItemNode } from '$lib/types/wp-types.ts'
  import Masonry from 'svelte-bricks'
  let [minColWidth, maxColWidth, gap] = [400, 800, 30]
  let items: PortfolioItemNode[] = block.portfolioBlock.portfolioItems.nodes
  $: items
</script>

<div class="bg-black">
  <Masonry {items} {minColWidth} {maxColWidth} {gap} idKey="slug" let:item animate>
    <PortfolioItem block={item} />
  </Masonry>
</div>
