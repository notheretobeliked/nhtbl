<script lang="ts">
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import SurveyContainer from '$components/SurveyContainer.svelte'
	import type { EditorBlock } from '$lib/types/wp-types'

	interface PortfolioMeta {
		title?: string
		excerpt?: string
		clients?: string[]
		services?: string[]
		yearDisplay?: string
	}

	interface Props {
		editorBlocks?: EditorBlock[]
		pageType?: string
		portfolio?: PortfolioMeta
		backgroundColour?: string
		hasSurvey?: boolean
		pageId?: string | number
		isHomePage?: boolean
	}

	let {
		editorBlocks = [],
		pageType = 'page',
		portfolio = {},
		backgroundColour = 'white',
		hasSurvey = false,
		pageId,
		isHomePage = false
	}: Props = $props()

	let isPortfolio = $derived(pageType === 'portfolio')
</script>

{#if isPortfolio}
	<!-- Portfolio item: grey canvas + a sticky black title card, with the section
	     blocks rendered inside .portfolio-content (drives the sticky-stack CSS). -->
	<div class="portfolio-page min-h-screen bg-nhtbl-grey-base text-black px-2">
		<div
			class="max-w-[980px] w-full mx-auto pt-20 lg:pt-4 lg:absolute lg:left-1/2 lg:-translate-x-1/2 top-48 z-10 p-4 bg-black text-white"
		>
			<h1 class="font-sans text-lg lg:text-xl my-4">{portfolio.title}</h1>
			<div class="grid lg:grid-cols-[2fr_1fr] alignwide gap-7 mb-7">
				<div class="text-lg lg:text-xl">{@html portfolio.excerpt ?? ''}</div>
				<div class="flex flex-col gap-2">
					{#if portfolio.clients?.length}
						<p class="text-sm lg:text-base text-gray-600">
							With/for:
							{#each portfolio.clients as client}{client}{/each}
							{portfolio.yearDisplay ? ` ${portfolio.yearDisplay}` : ''}
						</p>
					{/if}
					{#if portfolio.services?.length}
						<div class="services flex flex-row gap-2 mt-4 flex-wrap">
							{#each portfolio.services as service}
								<div class="font-sans text-sm rounded-full border border-white px-2 py-0 whitespace-nowrap">
									{service}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="portfolio-content">
			{#each editorBlocks as block (block.clientId)}
				<BlockRenderer {block} />
			{/each}
		</div>
	</div>
{:else}
	<div class="page-main bg-{backgroundColour} {isHomePage ? 'pt-0 pb-0' : 'pt-24'} min-h-screen flex flex-col">
		{#if hasSurvey}
			<SurveyContainer blocks={editorBlocks} pageId={pageId ?? ''}>
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
{/if}
