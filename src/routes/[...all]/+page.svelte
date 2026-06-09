<script lang="ts">
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import SurveyContainer from '$components/SurveyContainer.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
	let isHomePage = $derived(data.uri === '/')
	let editorBlocks = $derived(data.editorBlocks ?? [])
	let hasSurvey = $derived((data as any).hasSurvey === true)
</script>

<div class="page-main {isHomePage ? 'pt-14 pb-0' : 'pt-24'} min-h-screen flex flex-col">
	{#if hasSurvey}
		<SurveyContainer blocks={editorBlocks} pageId={(data as any).id}>
			{#each editorBlocks as block (block.clientId)}
				<BlockRenderer {block} />
			{/each}
		</SurveyContainer>
	{:else}
		{#each editorBlocks as block (block.clientId)}
			<BlockRenderer {block} />
		{/each}
	{/if}
</div>
