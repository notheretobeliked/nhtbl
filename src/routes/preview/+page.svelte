<script lang="ts">
	import PageBody from '$components/PageBody.svelte'
	import PreviewBanner from '$components/PreviewBanner.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<PreviewBanner
	isPreview={data.isPreview}
	lastModified={data.previewData?.lastModified}
	canEdit={data.previewData?.canEdit}
/>

<PageBody
	editorBlocks={data.editorBlocks ?? []}
	pageType={(data as any).pageType}
	portfolio={(data as any).portfolio ?? {}}
	backgroundColour={(data as any).backgroundColour ?? 'white'}
/>
