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
	$inspect(imageNode)
</script>

<figure class="acf-slide relative h-full w-full">
	{#if imageNode}
		<div class="absolute inset-0 h-full w-full">
			<Image imageObject={imageNode} imageSize="2048x2048" fit="cover" />
		</div>
	{/if}

	{#if caption}
		<figcaption
			class="absolute bottom-3 left-3 z-10 max-w-[50%] md:max-w-[33%] rounded bg-white/80 px-3 py-1.5 text-sm text-black backdrop-blur-sm [&_a]:underline"
		>
			{@html caption}
		</figcaption>
	{/if}
	</figure>

	<style lang="postcss">
		@reference '../../app.css';
		:global(figure.acf-slide p) {
			@apply mb-0 text-xs md:text-base;
		}
	</style>