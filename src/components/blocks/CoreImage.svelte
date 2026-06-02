<script lang="ts">
	import type { ExtendedEditorBlock } from '$lib/types/wp-types'
	import Image from '$components/atoms/Image.svelte'
	interface Props {
		block: ExtendedEditorBlock
	}

	let { block }: Props = $props()

	// Stamped during block processing (markStretchFill) when this image sits in a
	// min-height "stretch" section. When true the image fills the section
	// (100% w/h, object-fit: cover) instead of using its aspect ratio.
	const fill = Boolean((block.attributes as any)?.fill)


	// CoreImage blocks now include color data from WordPress
	const imageObject = {
		altText: (block as any).altText || block.attributes?.alt || '',
		colorPalette: (block as any).colorPalette || null,
		dominantColor: (block as any).dominantColor || null,
		secondaryColor: (block as any).secondaryColor || null,
		mediaDetails: {
			sizes: block.mediaDetails?.sizes ?? []
		},
		contentTypeName: 'attachment',
		databaseId: 0,
		id: '',
		isComment: false,
		isTermNode: false,
		slug: '',
		uri: ''
	} as MediaItem

	const aspectRatio = block.attributes?.aspectRatio || 'auto'

	const aspectRatioClass = (() => {
		switch (aspectRatio) {
			case '1':
				return 'aspect-square'
			case '4/3':
				return 'aspect-[4/3]'
			case '3/4':
				return 'aspect-[3/4]'
			case '3/2':
				return 'aspect-[3/2]'
			case '16/9':
				return 'aspect-[16/9]'
			case '9/16':
				return 'aspect-[9/16]'
			default:
				return 'aspect-auto'
		}
	})()

</script>

<figure class={fill ? 'h-full w-full' : 'mb-4 w-full'}>
	<Image {imageObject} imageSize="large" extraClasses={fill ? 'h-full w-full' : aspectRatioClass} fit="cover" />
	{#if block.attributes?.caption && !fill}
		<figcaption class="font-inter mt-2 text-center text-sm">{block.attributes.caption}</figcaption>
	{/if}
</figure>
