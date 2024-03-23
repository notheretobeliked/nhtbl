<script lang="ts">
    import type {EditorBlock} from '$lib/types/wp-types'
    // import Paragraph from '$components/blocks/Paragraph.svelte';
    import HomePageHero from '$components/blocks/HomePageHero.svelte';
    // import Heading from '$components/blocks//Heading.svelte';
    export let block:EditorBlock;
    if (block.name === 'acf/home-page-hero') console.log(block)
    
  </script>

{#if block.name === 'acf/home-page-hero'}
    <HomePageHero content={block.children} images={block.homePageHero.images.nodes}/>
{/if}
  