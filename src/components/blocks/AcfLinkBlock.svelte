<script lang="ts">
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { EditorBlock } from '$lib/types/wp-types'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	const children = $derived((block as any).children || [])
	const bgColor = $derived(block.attributes?.backgroundColor ?? 'white')
	const link = $derived(
		(block as any).linkBlock?.internalLink?.nodes?.[0]?.uri ??
			(block as any).linkBlock?.externalLink?.url
	)
</script>

<a
	class="block link-block p-2 hover:bg-white hover:!text-black transition-colors duration-300 rounded-lg"
	href={link}
>
	<div class="group m-auto {bgColor === 'black' && '!text-white'} overflow-hidden">
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</div>
</a>

<style>
	@reference "../../app.css";

	:global(.link-block img) {
		@apply transition-all duration-300;
	}

	:global(.link-block .group:hover img) {
		@apply scale-110;
	}
</style>
