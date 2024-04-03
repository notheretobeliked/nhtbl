<script lang="ts">
  export let block: EditorBlock
  const images = block.galerie.galerie.nodes
  console.log(images)
  import Carousel from '$components/Carousel.svelte';
</script>

<Carousel autoplay={true} images={images} />

