import { ISR_BYPASS_TOKEN } from '$env/static/private'
import { PUBLIC_SITE_URL } from '$env/static/public'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * On-demand ISR revalidation endpoint.
 *
 * The WordPress backend POSTs here when content changes:
 *   { "token": "<ISR_BYPASS_TOKEN>", "paths": ["/", "/some-page"] }
 *
 * For each path we re-fetch the page with Vercel's `x-prerender-revalidate`
 * header, which tells Vercel to regenerate that page's ISR cache entry from
 * fresh data. The token must match both the body token and the header.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { token, paths } = await request.json().catch(() => ({}))

	if (!token || token !== ISR_BYPASS_TOKEN) {
		return json({ error: 'Invalid token' }, { status: 401 })
	}

	if (!Array.isArray(paths) || paths.length === 0) {
		return json({ error: 'No paths provided' }, { status: 400 })
	}

	// SvelteKit caches the page HTML and its load data (`<path>/__data.json`) as
	// SEPARATE ISR entries. A full refresh fetches the HTML, but client-side
	// navigation only fetches the data — so we must revalidate both, or SPA
	// navigation keeps showing stale content after the HTML is already fresh.
	const dataPath = (p: string) => `${p === '/' ? '' : p.replace(/\/$/, '')}/__data.json`
	const targets = paths.flatMap((p: string) => [p, dataPath(p)])

	const results = await Promise.all(
		targets.map(async (path: string) => {
			try {
				const url = new URL(path, PUBLIC_SITE_URL)
				const res = await fetch(url.toString(), {
					headers: { 'x-prerender-revalidate': ISR_BYPASS_TOKEN }
				})
				return { path, status: res.status }
			} catch {
				return { path, status: 500 }
			}
		})
	)

	return json({ revalidated: results })
}
