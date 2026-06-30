import { WORDPRESS_URL } from '$env/static/private'
import PreviewById from '$lib/graphql/query/preview-by-id.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error, isHttpError, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical, normalizeAssetUrlsInObject } from '$lib/server/utilities'

export const prerender = false // Disable prerendering for preview functionality

function formatYearRange(start?: string | null, end?: string | null): string {
	if (!start && !end) return ''
	if (!start && end) return `(${new Date(end).getFullYear()})`
	// Ongoing: treat a missing end as January of the current year.
	if (start && !end) end = `${new Date().getFullYear()}-01-01`
	const s = new Date(start!).getFullYear()
	const e = new Date(end!).getFullYear()
	return s === e ? `(${s})` : `(${s}–${String(e).slice(-2)})`
}

export const load: PageServerLoad = async function load({ url }) {
	// Check if this is a preview request
	const isPreview = url.searchParams.has('preview') || url.searchParams.has('p') || url.searchParams.has('page_id')
	const previewId = url.searchParams.get('p') || url.searchParams.get('page_id')
	const previewToken = url.searchParams.get('token')

	// Handle authentication for previews
	let authResult: { authenticated: boolean; token?: string } = { authenticated: false }
	if (isPreview) {
		if (previewToken) {
			authResult = {
				authenticated: true,
				token: previewToken
			}
		} else {
			// No token provided - redirect to WordPress to get one
			const returnUrl = encodeURIComponent(url.href)
			const loginUrl = `${WORDPRESS_URL}/wp/wp-login.php?redirect_to=${returnUrl}`
			throw redirect(302, loginUrl)
		}
	}

	try {
		let pageResponse: Response

		if (isPreview && previewId && previewToken) {
			// Use preview query by ID with token authentication
			pageResponse = await graphqlQuery(
				PreviewById,
				{ id: previewId },
				{ token: previewToken }
			)
		} else {
			// Fallback - shouldn't normally reach here
			error(400, 'Preview requires a post ID and token')
		}

		checkResponse(pageResponse)
		const pageData = await pageResponse.json()

		// Handle GraphQL errors
		if (pageData.errors) {
			console.error('GraphQL errors:', pageData.errors)
			error(500, 'GraphQL query failed')
		}

		// asPreview coerces the autosave to whatever type you query, so both page
		// and nhtblProject return non-null for any id. Use the post_type the
		// backend appends to the preview link to pick the right one.
		const isPortfolio = url.searchParams.get('post_type') === 'project'
		const node = isPortfolio
			? pageData?.data?.nhtblProject
			: pageData?.data?.page || pageData?.data?.nhtblProject

		if (!node) {
			error(404, `Preview not found for post ID: ${previewId}`)
		}

		// Validate preview status
		if (node.status && !['publish', 'draft', 'private', 'pending', 'inherit'].includes(node.status)) {
			error(404, 'Preview not available')
		}

		// Normalize asset URLs
		normalizeAssetUrlsInObject(pageData)

		let editorBlocks: EditorBlock[] = node?.editorBlocks
			? flatListToHierarchical(node.editorBlocks, {}, pageData.data)
			: []

		// Mirror the catch-all's portfolio presentation so previews match the live
		// page (grey canvas + title card). Drop the excerpt block (shown in card).
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

		return {
			data: pageData.data,
			uri: '/',
			editorBlocks: editorBlocks,
			isPreview: true,
			authenticated: authResult.authenticated,
			pageType: isPortfolio ? 'portfolio' : 'page',
			portfolio,
			backgroundColour:
				((node as any).backgroundColour?.backgroundColour?.[0] as string) ?? 'white',
			previewData: {
				status: node.status || 'unknown',
				lastModified: node.modified || node.date,
				canEdit: authResult.authenticated
			}
		}
	} catch (err: unknown) {
		// Check if it's already an HTTP error (like a 404)
		if (isHttpError(err)) {
			throw err
		}

		// Check if it's a response with status
		if (err instanceof Response) {
			const status = err.status
			error(status || 500, `Error fetching preview: ${await err.text()}`)
		}

		// For errors with status property
		const httpError = err as { status?: number; message?: string }
		if (httpError.status) {
			error(httpError.status, httpError.message || 'Preview error')
		}

		// For any other error
		const errorMessage = err instanceof Error ? err.message : 'Internal Server Error'
		error(500, errorMessage)
	}
}
