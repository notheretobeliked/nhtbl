<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  export let block: ExtendedEditorBlock
  const images = block.galerie.galerie.nodes
  import Carousel from '$components/Carousel.svelte';
</script>

<Carousel autoplay={true} images={images} />

