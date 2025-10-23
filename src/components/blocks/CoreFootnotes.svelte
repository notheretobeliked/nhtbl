<script lang="ts">
	import type { CoreFootnotes } from '$lib/graphql/generated'
	interface Props {
		block: CoreFootnotes;
	}

	let { block }: Props = $props();
</script>

{#if block.renderedHtml}<div class="footnotes border-t border-black mt-9 py-3">
		{@html block.renderedHtml}
	</div>{/if}

<style lang="postcss">
	.footnotes :global(ol) {
		list-style: none;
	}

	.footnotes :global(li) {
		padding-left: -1rem;
		text-indent: 1rem;
		overflow-wrap: break-word;
		word-wrap: break-word;
		hyphens: auto;
	}

	.footnotes :global(li::before) {
		content: counter(list-item) '— ';
	}
</style>
