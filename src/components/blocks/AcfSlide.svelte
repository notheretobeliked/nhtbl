<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import Image from '$components/atoms/Image.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	// ACF field group `slide` → { image { node }, caption (wysiwyg HTML) }
	let slide = $derived((block as Record<string, any>).slide ?? {})
	let imageNode = $derived(slide?.image?.node ?? null)
	let caption = $derived((slide?.caption ?? '') as string)
</script>

<div class="acf-slide relative h-full w-full">
	{#if imageNode}
		<div class="absolute inset-0 h-full w-full">
			<Image imageObject={imageNode} imageSize="large" fit="cover" />
		</div>
	{/if}

	{#if caption}
		<figcaption
			class="absolute bottom-3 left-3 z-10 max-w-[80%] rounded bg-white/80 px-3 py-1.5 text-sm text-black backdrop-blur-sm [&_a]:underline"
		>
			{@html caption}
		</figcaption>
	{/if}
</div>
