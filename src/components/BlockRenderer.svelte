<script lang="ts">
  import type { EditorBlock, ACFHomePageHero, ACFServicePush } from '$lib/types/wp-types'
  import CoreParagraph from '$components/blocks/CoreParagraph.svelte'
  import CoreHeading from '$components/blocks/CoreHeading.svelte'

  import HomePageHero from '$components/blocks/HomePageHero.svelte'
  import ServicePush from '$components/blocks/ServicePush.svelte'
  import CoreGroup from '$components/blocks/CoreGroup.svelte'
  import CoreColumns from '$components/blocks/CoreColumns.svelte'
  import CoreColumn from '$components/blocks/CoreColumn.svelte'
  import CoreSpacer from './blocks/CoreSpacer.svelte'
  import PortfolioBlock from './blocks/PortfolioBlock.svelte'
  import GalerieBlock from './blocks/GalerieBlock.svelte'

  export let block: EditorBlock

  function isACFHomePageHero(block: EditorBlock): block is ACFHomePageHero {
    return (block as ACFHomePageHero).homePageHero !== undefined
  }

  function isACFServicePush(block: EditorBlock): block is ACFServicePush {
    return (block as ACFServicePush).servicePush !== undefined
  }

  const align = block.attributes.align || 'none'
  const bgColor = block.attributes.backgroundColor ?? 'white'

  // Adjusted function to work directly with the style object
  function mapSpacingToTailwind(styleObj): string {
    let classes = ''
    const topPadding = styleObj?.spacing?.padding?.top?.replace('spacing|', '')
    const bottomPadding = styleObj?.spacing?.padding?.bottom?.replace('spacing|', '')

    if (topPadding) {
      const topValue = parseInt(topPadding, 10) / 10 // Convert "20" to 2, "30" to 3, etc.
      classes += ` pt-${topValue}` // Append the Tailwind class for top padding
    }

    if (bottomPadding) {
      const bottomValue = parseInt(bottomPadding, 10) / 10 // Similar conversion for bottom
      classes += ` pb-${bottomValue}` // Append the Tailwind class for bottom padding
    }

    return classes.trim()
  }

  // Use the style object directly if it exists
  const spacingClasses = block.attributes.style ? mapSpacingToTailwind(block.attributes.style) : ''

  const classNames = align => {
    let baseClasses = ''
    switch (align) {
      case 'full':
        baseClasses = 'w-full max-w-full'
        break
      case 'wide':
        baseClasses = 'w-full max-w-[980px] mx-auto'
        break
      case 'none':
        baseClasses = 'w-full max-w-[852px] mx-auto'
        break
      case null:
        baseClasses = 'w-full'
        break
    }
    return `${baseClasses} ${spacingClasses}` // Combine base classes with spacing classes
  }
</script>

<div class="{classNames(align)} bg-{bgColor} !px-0">
  {#if isACFHomePageHero(block)}
    <HomePageHero {block} />
  {/if}

  {#if isACFServicePush(block)}
    <ServicePush {block} />
  {/if}

  {#if block.name === 'core/group'}
    <CoreGroup {block} />
  {/if}

  {#if block.name === 'core/columns'}
    <CoreColumns {block} />
  {/if}

  {#if block.name === 'core/column'}
    <CoreColumn {block} />
  {/if}

  {#if block.name === 'core/paragraph'}
    <CoreParagraph {block} />
  {/if}

  {#if block.name === 'core/heading'}
    <CoreHeading {block} />
  {/if}

  {#if block.name === 'core/spacer'}
    <CoreSpacer {block} />
  {/if}

  {#if block.name === 'acf/portfolio-block'}
    <PortfolioBlock {block} />
  {/if}

  {#if block.name === 'acf/galerie'}
    <GalerieBlock {block} />
  {/if}
</div>
