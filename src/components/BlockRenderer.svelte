<script lang="ts">
    import type {EditorBlock} from '$lib/types/wp-types'
    import CoreParagraph from '$components/blocks/CoreParagraph.svelte';
    import CoreHeading from '$components/blocks/CoreHeading.svelte';

    import HomePageHero from '$components/blocks/HomePageHero.svelte';
    import ServicePush from '$components/blocks/ServicePush.svelte';
    import CoreGroup from '$components/blocks/CoreGroup.svelte';
    import CoreColumns from '$components/blocks/CoreColumns.svelte';
    import CoreColumn from '$components/blocks/CoreColumn.svelte';
    import PortfolioBlock from './blocks/PortfolioBlock.svelte';
    export let block:EditorBlock;
    
  </script>

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

{#if block.name === 'acf/portfolio-block'}
    <PortfolioBlock block={block} />
{/if}