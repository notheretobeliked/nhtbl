<script lang="ts">
	import type { CoreVideo } from '$lib/graphql/generated'
	import Video from '$components/atoms/Video.svelte'
	
	interface Props {
		block: CoreVideo
	}

	let { block }: Props = $props()

	// Extract video attributes with defaults
	const src = block.attributes?.src || ''
	const autoplay = block.attributes?.autoplay || false
	const controls = block.attributes?.controls !== false // Default to true unless explicitly false
	const loop = block.attributes?.loop || false
	const muted = block.attributes?.muted || false
	const playsInline = block.attributes?.playsInline || false
	const preload = block.attributes?.preload || 'metadata'
	const caption = block.attributes?.caption || ''
	const align = block.attributes?.align || null

	// Handle alignment classes
	const alignmentClass = $derived.by(() => {
		switch (align) {
			case 'left':
				return 'text-left'
			case 'center':
				return 'text-center mx-auto'
			case 'right':
				return 'text-right ml-auto'
			case 'wide':
				return 'w-full max-w-screen-lg mx-auto'
			case 'full':
				return 'w-full'
			default:
				return ''
		}
	})
</script>

<figure class="mb-4 w-full {alignmentClass}">
	{#if src}
		<Video 
			{src}
			{autoplay}
			{controls}
			{loop}
			{muted}
			{playsInline}
			{preload}
			fit="cover"
		/>
	{:else}
		<div class="bg-gray-200 flex items-center justify-center h-64 text-gray-500">
			No video source provided
		</div>
	{/if}
	{#if caption}
		<figcaption class="font-inter mt-2 text-center text-sm">{caption}</figcaption>
	{/if}
</figure>
