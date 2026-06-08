<script lang="ts">
	import type { EditorBlock, ImageSize } from '$lib/types/wp-types'
	import { findImageSizeData, getSrcSet } from '$lib/utilities/utilities'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	// ACF field group `slide` → { image { node }, caption (wysiwyg HTML) }
	let slide = $derived((block as Record<string, any>).slide ?? {})
	let imageNode = $derived(slide?.image?.node ?? null)
	let caption = $derived((slide?.caption ?? '') as string)

	function sizesOf(node: any): ImageSize[] {
		return (node?.mediaDetails?.sizes ?? [])
			.filter((s: any) => s && typeof s.name === 'string')
			.map((s: any) => ({
				sourceUrl: s.sourceUrl ?? '',
				width: parseInt(s.width ?? '0'),
				height: parseInt(s.height ?? '0'),
				name: s.name ?? ''
			}))
	}

	let sizes = $derived(sizesOf(imageNode))
</script>

<div class="acf-slide relative h-full w-full">
	{#if imageNode}
		<img
			src={findImageSizeData('sourceUrl', sizes, 'large')}
			srcset={getSrcSet(sizes)}
			sizes="100vw"
			alt={imageNode?.altText ?? ''}
			loading="lazy"
			class="absolute inset-0 h-full w-full object-cover"
		/>
	{/if}

	{#if caption}
		<figcaption
			class="absolute bottom-3 left-3 z-10 max-w-[80%] rounded bg-white/80 px-3 py-1.5 text-sm text-black backdrop-blur-sm [&_a]:underline"
		>
			{@html caption}
		</figcaption>
	{/if}
</div>
