<script lang="ts">
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { PageData } from './$types'
	import PreviewBanner from '$components/PreviewBanner.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	const editorBlocks = $derived(data.editorBlocks || [])
	const uri = $derived(data.uri || '')
	const isHomePage = $derived(uri === '/')
	const isPortfolioProject = $derived(data.pageType === 'portfolio-item')

	// Portfolio-specific data
	const title = $derived(data.title || 'Preview')
	const excerpt = $derived(data.excerpt || '')
	const clients = $derived(data.clients || [])
	const services = $derived(data.services || [])
	const yearDisplay = $derived(data.yearDisplay || '')
</script>

<PreviewBanner
	isPreview={data.isPreview || false}
	lastModified={data.previewData?.lastModified || null}
	canEdit={data.previewData?.canEdit || false}
/>

{#if isPortfolioProject}
	<!-- Portfolio Project Preview Layout — mirrors /portfolio/[slug] -->
	<div class="portfolio-page min-h-screen bg-nhtbl-grey-base text-black px-2">
		<div
			class="max-w-[980px] w-full mx-auto pt-20 lg:pt-4 lg:absolute lg:left-1/2 lg:-translate-x-1/2 top-48 z-10 p-4 bg-black text-white"
		>
			<h1 class="font-sans text-lg lg:text-xl my-4">
				{title}
			</h1>
			<div class="grid lg:grid-cols-[2fr_1fr] alignwide gap-7 mb-7">
				<div class="text-lg lg:text-xl">
					{@html excerpt}
				</div>
				<div class="flex flex-col gap-2">
					<!-- Clients -->
					{#if clients.length > 0}
						<p class="text-sm lg:text-base text-gray-600">
							With/for:
							{#each clients as client}
								{client}
							{/each}
							{yearDisplay ? ` ${yearDisplay}` : ''}
						</p>
					{/if}

					<!-- Services -->
					{#if services.length > 0}
						<div class="services flex flex-row gap-2 mt-4 flex-wrap">
							{#each services as service}
								<div class="font-sans text-sm rounded-full border border-white px-2 py-0 whitespace-nowrap">{service}</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
		<!-- Render editor blocks from WordPress -->
		<div class="portfolio-content">
			{#each editorBlocks as block (block.clientId)}
				<BlockRenderer {block} />
			{/each}
		</div>
	</div>
{:else}
	<!-- Regular Page Preview Layout -->
	<div class="{isHomePage ? 'homepage' : ''} app-content">
		{#each editorBlocks as block (block.clientId)}
			<BlockRenderer {block} />
		{/each}
	</div>
{/if}
