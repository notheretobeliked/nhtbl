<script lang="ts">
	import PageBody from '$components/PageBody.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
	let isHomePage = $derived(data.uri === '/')
</script>

<PageBody
	editorBlocks={data.editorBlocks ?? []}
	pageType={(data as any).pageType}
	portfolio={(data as any).portfolio ?? {}}
	backgroundColour={(data as any).backgroundColour ?? 'white'}
	hasSurvey={(data as any).hasSurvey === true}
	pageId={(data as any).id}
	{isHomePage}
/>
