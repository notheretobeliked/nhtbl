<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import Carousel from '$components/Carousel.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	const images = $derived((block as any).galerie?.galerie?.nodes ?? [])
</script>

<Carousel autoplay={true} images={images} />
