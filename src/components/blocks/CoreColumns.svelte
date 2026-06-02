<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import { getContext } from 'svelte'
  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()

  // Provided by an ancestor CoreGroup in a min-height "stretch" section so the
  // columns fill the section height. Undefined when not inside such a section.
  const fillCtx = getContext<{ value: boolean }>('fill-height')

  const isStackedOnMobile: boolean = block.attributes?.isStackedOnMobile ?? false

  // Create CSS grid template columns from individual column widths
  function getGridTemplateColumns(): string {
    const children = (block as any).children || []
    return children.map((child: any) => child.attributes?.width || '1fr').join(' ') || '1fr'
  }

  // Get the grid style object
  function getGridStyle(): string {
    const gridTemplateColumns = getGridTemplateColumns()
    return `grid-template-columns: ${gridTemplateColumns};`
  }

  // Get CSS classes for responsive behavior
  function getCssClasses(): string {
    const fillClass = fillCtx?.value ? 'h-full' : ''
    const baseClasses = `${block.attributes?.className || ''} corecolumns grid ${fillClass}`
    return baseClasses.trim()
  }
</script>

<div
  class="{getCssClasses()}  gap-4"
  data-stacked={isStackedOnMobile}
  style={isStackedOnMobile ? `grid-template-columns: 1fr; --grid-columns: ${getGridTemplateColumns()};` : getGridStyle()}
>
  {#each (block as any).children || [] as childBlock, index}
    <BlockRenderer block={childBlock} />
  {/each}
</div>

<style>
  @media (min-width: 768px) {
    .corecolumns[data-stacked='true'] {
      grid-template-columns: var(--grid-columns) !important;
    }
  }
</style>
