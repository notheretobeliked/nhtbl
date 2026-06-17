import { ISR_BYPASS_TOKEN } from '$env/static/private'

// Incremental Static Regeneration: each dynamic page is rendered once, cached on
// Vercel's edge, and only re-rendered on demand when the backend POSTs to
// /api/revalidate (which re-fetches it with the x-prerender-revalidate header).
// expiration:false = cache until explicitly revalidated (no time-based refresh).
export const config = {
	isr: {
		expiration: false,
		bypassToken: ISR_BYPASS_TOKEN
	}
}

import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error, isHttpError } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical, normalizeAssetUrlsInObject } from '$lib/server/utilities'
import { resolvePortfolioProjects } from '$lib/utilities/portfolioResolver'
import { getAllProjects } from '$lib/utilities/projectsCache'

/**
 * Resolve acf/portfolio-block project lists server-side, attaching the result as
 * `resolvedProjects` on each portfolio block (read by PortfolioBlock.svelte).
 * Only fetches the full project list when a block needs more than the specific
 * projects already embedded in its GraphQL response.
 */
async function resolvePortfolioBlocks(blocks: EditorBlock[]): Promise<EditorBlock[]> {
	const portfolioBlocks: any[] = []
	const collect = (list: EditorBlock[]) => {
		for (const b of list) {
			if (b.name === 'acf/portfolio-block') portfolioBlocks.push(b)
			if ((b as any).children) collect((b as any).children)
		}
	}
	collect(blocks)
	if (!portfolioBlocks.length) return blocks

	const needsAll = portfolioBlocks.some((b) => {
		const c = b.portfolioBlock
		return (
			c?.projectSource === 'all' ||
			c?.projectSource === 'by_service' ||
			(c?.projectSource === 'specific' &&
				(!c?.specificProjects?.nodes?.[0]?.title || !c?.specificProjects?.nodes?.[0]?.featuredImage))
		)
	})
	const allProjects = needsAll ? await getAllProjects() : []

	for (const b of portfolioBlocks) {
		if (b.portfolioBlock) {
			;(b as any).resolvedProjects = resolvePortfolioProjects(b.portfolioBlock, allProjects as any)
		}
	}
	return blocks
}

/** Format a project's start/end dates as a compact year range, e.g. "(2023–24)". */
function formatYearRange(start?: string | null, end?: string | null): string {
	if (!start && !end) return ''
	if (!start && end) return `(${new Date(end).getFullYear()})`
	if (start && !end) return `(${new Date(start).getFullYear()} –)`
	const s = new Date(start!).getFullYear()
	const e = new Date(end!).getFullYear()
	return s === e ? `(${s})` : `(${s}–${String(e).slice(-2)})`
}

export const load: PageServerLoad = async function load({ params, url, fetch }) {
	const uri = `/${params.all || ''}`.replace(/\/+/g, '/') // Normalize multiple slashes

	// Handle system routes and static assets
	const systemRoutes = [
		'/.well-known',
		'/apple-touch-icon',
		'/favicon',
		'/robots.txt',
		'/sitemap.xml'
	]

	const isSystemRoute = systemRoutes.some(route => uri.startsWith(route))
	const isStaticAsset = uri.match(/\.(jpg|png|gif|svg|css|js|ico|webp|avif)$/i)

	if (isSystemRoute || isStaticAsset) {
		error(404, 'Not a page route')
	}

	try {
		const pageResponse = await graphqlQuery(PageContent, { uri: uri })
		checkResponse(pageResponse)
		const pageData = await pageResponse.json()

		// Only throw 404 if we truly have no page data to work with
		if (!pageData?.data?.nodeByUri) {
			error(404, `Page not found for URI: ${uri}`)
		}

		// Normalize asset URLs in page data if CDN is configured
		normalizeAssetUrlsInObject(pageData)

		const node = pageData.data.nodeByUri

		let editorBlocks: EditorBlock[] = node.editorBlocks
			? flatListToHierarchical(node.editorBlocks, {}, pageData.data)
			: []

		// Attach post-level context to blocks (for CorePostDate, CorePostFeaturedImage on single pages)
		const rawFeaturedImage = node.featuredImage as Record<string, unknown> | undefined
		const postContext = {
			postTitle: node.title as string | undefined,
			postDate: node.date as string | undefined,
			postUri: uri,
			postFeaturedImage: (rawFeaturedImage?.node ?? rawFeaturedImage) as Record<string, unknown> | undefined,
		}

		function attachPostContext(blocks: EditorBlock[]): void {
			for (const block of blocks) {
				Object.assign(block, postContext)
				if (block.children) attachPostContext(block.children)
			}
		}

		if (postContext.postDate || postContext.postFeaturedImage) {
			attachPostContext(editorBlocks)
		}

		// Resolve acf/portfolio-block project lists server-side.
		editorBlocks = await resolvePortfolioBlocks(editorBlocks)

		// A page with a survey block is wrapped in <SurveyContainer> client-side.
		const hasSurvey = (function check(list: EditorBlock[]): boolean {
			return list.some(
				(b) =>
					b.name === 'acf/survey-block' ||
					(!!(b as any).children?.length && check((b as any).children))
			)
		})(editorBlocks)

		// Portfolio items reuse this loader + blocks; only the presentation differs
		// (see +page.svelte). Compute the title-card extras and drop the excerpt
		// block (it's shown in the card instead).
		const isPortfolio = (node as any).__typename === 'Nhtbl_project'
		let portfolio: Record<string, unknown> | undefined
		if (isPortfolio) {
			const services = ((node as any).nhtblServices?.nodes ?? [])
				.filter((s: any) => s?.parentId !== null && s?.parentId !== undefined)
				.map((s: any) => s?.name)
				.filter(Boolean)
			const clients = ((node as any).nhtblClients?.nodes ?? [])
				.map((c: any) => c?.name)
				.filter(Boolean)
			portfolio = {
				title: (node as any).title ?? '',
				excerpt: (node as any).excerpt ?? '',
				clients,
				services,
				yearDisplay: formatYearRange(
					(node as any).projectData?.startDate,
					(node as any).projectData?.endDate
				)
			}
			editorBlocks = editorBlocks.filter((b) => b.name !== 'core/post-excerpt')
		}

		// Page background colour (ACF field, returned as a slug array).
		const backgroundColour =
			((node as any).backgroundColour?.backgroundColour?.[0] as string) ?? 'white'

		return {
			data: pageData.data,
			uri: uri,
			editorBlocks: editorBlocks,
			hasSurvey,
			id: (node as { databaseId?: number }).databaseId,
			pageType: isPortfolio ? 'portfolio' : 'page',
			portfolio,
			backgroundColour
		}
	} catch (err: unknown) {
		console.error('Server Error:', err)

		// Check if it's already an HTTP error (like a 404)
		if (isHttpError(err)) {
			throw err
		}

		// Check if it's a response with status
		if (err instanceof Response) {
			const status = err.status
			if (status === 404) {
				error(404, `Page not found for URI: ${uri}`)
			}
			error(status || 500, `Error fetching page: ${await err.text()}`)
		}

		// For errors with status property (from GraphQL or other sources)
		const httpError = err as { status?: number; message?: string }
		if (httpError.status === 404 ||
		    (httpError.message && httpError.message.includes('not found'))) {
			error(404, httpError.message || `Page not found for URI: ${uri}`)
		}

		// For any other error
		const errorMessage = err instanceof Error ? err.message : 'Internal Server Error'
		error(500, errorMessage)
	}
}
