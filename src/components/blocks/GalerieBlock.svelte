<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  import Carousel from '$components/Carousel.svelte';
  
  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()
  const images = block.galerie.galerie.nodes
</script>

<Carousel autoplay={true} images={images} />

