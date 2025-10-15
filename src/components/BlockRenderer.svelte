<script lang="ts">
  import { inview } from 'svelte-inview'
  import type { ObserverEventDetails, ScrollDirection, Options } from 'svelte-inview'
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'

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
  import CoreButtons from './blocks/CoreButtons.svelte'
  import CoreButton from './blocks/CoreButton.svelte'
  import AcfLinkBlock from './blocks/AcfLinkBlock.svelte'
  import CoreImage from './blocks/CoreImage.svelte'
  import CoreVideo from './blocks/CoreVideo.svelte'
  import AcfSurveyBlock from './blocks/AcfSurveyBlock.svelte'

  interface Props {
    forceFull?: boolean
    block: ExtendedEditorBlock
  }

  let { forceFull = false, block }: Props = $props()

  let isInView = $state(false)

  const options: Options = {
    rootMargin: '-50px',
    unobserveOnEnter: true,
  }

  const handleChange = ({ detail }: CustomEvent<ObserverEventDetails>) => {
    isInView = detail.inView
  }

  const align = $derived(forceFull ? 'full' : block.attributes?.align || 'none')
  const bgColor = $derived(block.attributes?.backgroundColor ?? 'none')

  // Adjusted function to work directly with the style object
  function mapSpacingToTailwind(styleObj: any): string {
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
  const spacingClasses = block.attributes?.style ? mapSpacingToTailwind(block.attributes.style) : ''

  const classNames = (align: string | null | undefined): string => {
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
      case 'center':
        baseClasses = 'w-full max-w-[852px] mx-auto'
        break
      case null:
        baseClasses = 'w-full'
        break
    }
    return `${baseClasses} ${spacingClasses}` // Combine base classes with spacing classes
  }

  // Type-safe block name checking
  const blockName = block.name || ''

  // Helper functions to check block types based on properties that exist in those specific ACF blocks
  function hasHomePageHero(block: any): boolean {
    return 'homePageHero' in block && block.homePageHero !== null && block.homePageHero !== undefined
  }

  function hasServicePush(block: any): boolean {
    return 'servicePush' in block && block.servicePush !== null && block.servicePush !== undefined
  }
</script>

<div class="{classNames(align)} bg-{bgColor} !px-0" use:inview={options} on:inview_change={handleChange}>
  <div class="transition-all duration-[800ms] ease-in-out h-full {isInView ? 'transform-none opacity-1' : ' translate-y-2 opacity-0.2'}" data-inview={isInView}>
    {#if hasHomePageHero(block)}
      <HomePageHero {block} />
    {/if}

    {#if hasServicePush(block)}
      <ServicePush {block} />
    {/if}

    {#if blockName === 'core/group'}
      <CoreGroup {block} />
    {/if}

    {#if blockName === 'core/buttons'}
      <CoreButtons {block} />
    {/if}

    {#if blockName === 'core/button'}
      <CoreButton {block} />
    {/if}

    {#if blockName === 'core/columns'}
      <CoreColumns {block} />
    {/if}

    {#if blockName === 'core/column'}
      <CoreColumn {block} />
    {/if}

    {#if blockName === 'core/paragraph'}
      <CoreParagraph {block} />
    {/if}

    {#if blockName === 'core/heading'}
      <CoreHeading {block} />
    {/if}

    {#if blockName === 'core/spacer'}
      <CoreSpacer {block} />
    {/if}

    {#if blockName === 'core/image'}
      <CoreImage {block} />
    {/if}

    {#if blockName === 'core/video'}
      <CoreVideo {block} />
    {/if}

    {#if blockName === 'acf/portfolio-block'}
      <PortfolioBlock block={block as any} />
    {/if}

    {#if blockName === 'acf/galerie'}
      <GalerieBlock {block} />
    {/if}

    {#if blockName === 'acf/link-block'}
      <AcfLinkBlock {block} />
    {/if}

    {#if blockName === 'acf/survey-block'}
      <AcfSurveyBlock {block} />
    {/if}
  </div>
</div>
