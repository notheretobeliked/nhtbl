<script lang="ts">
    import type {
        EditorBlock
    } from '$lib/types/wp-types'
    import CoreParagraph from '$components/blocks/CoreParagraph.svelte';
    import CoreHeading from '$components/blocks/CoreHeading.svelte';

    import HomePageHero from '$components/blocks/HomePageHero.svelte';
    import ServicePush from '$components/blocks/ServicePush.svelte';
    import CoreGroup from '$components/blocks/CoreGroup.svelte';
    import CoreColumns from '$components/blocks/CoreColumns.svelte';
    import CoreColumn from '$components/blocks/CoreColumn.svelte';
    import CoreSpacer from './blocks/CoreSpacer.svelte';
    import PortfolioBlock from './blocks/PortfolioBlock.svelte';
    import GalerieBlock from './blocks/GalerieBlock.svelte';
    export let block: EditorBlock;
    const align = block.attributes.align || 'none';


    const classNames = (align) => {
        switch (align) {
            case "full":
                return 'px-2 w-full max-w-full';
            case "wide":
                return 'px-2 w-full max-w-[980px] mx-auto';
            case "none":
                return "px-2 w-full max-w-[852px] mx-auto";
            case null:
                return "px-2 w-full";
        }
    }
</script>
<div class={classNames(align)}>
    {#if block.name === 'acf/home-page-hero'}
    <HomePageHero content={block.children} images={block.homePageHero.images.nodes}/>
{/if}
  
{#if block.name === 'acf/service-push'}
<ServicePush block={block} />
{/if}

{#if block.name === 'core/group'}
    <CoreGroup block={block} />
{/if}

{#if block.name === 'core/columns'}
    <CoreColumns block={block} />
{/if}


{#if block.name === 'core/column'}
    <CoreColumn block={block} />
{/if}

{#if block.name === 'core/paragraph'}
    <CoreParagraph block={block} />
{/if}

{#if block.name === 'core/heading'}
    <CoreHeading block={block} />
{/if}

{#if block.name === 'core/spacer'}
    <CoreSpacer block={block} />
{/if}

{#if block.name === 'acf/portfolio-block'}
    <PortfolioBlock block={block} />
{/if}


{#if block.name === 'acf/galerie'}
    <GalerieBlock block={block} />
{/if}
</div>
