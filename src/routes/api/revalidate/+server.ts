import { ISR_BYPASS_TOKEN } from '$env/static/private'
import { PUBLIC_SITE_URL } from '$env/static/public'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

// Give the background regenerations room to finish (each path is a full SSR).
export const config = { maxDuration: 60 }

// How many regenerations to run at once. Each one calls back into WP's GraphQL,
// so a high number dogpiles the backend's PHP-FPM workers (and contends with
// the editor's own save). Keep it low.
const CONCURRENCY = 3

/** Run `fn` over `items` with at most `limit` in flight at a time. */
async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<unknown>): Promise<void> {
	const queue = [...items]
	const worker = async () => {
		while (queue.length) {
			const item = queue.shift() as T
			await fn(item).catch(() => {}) // one failure shouldn't stop the rest
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, queue.length) }, worker))
}

/**
 * On-demand ISR revalidation endpoint.
 *
 * The WordPress backend POSTs here when content changes:
 *   { "token": "<ISR_BYPASS_TOKEN>", "paths": ["/", "/some-page"] }
 *
 * Each path is re-fetched with Vercel's `x-prerender-revalidate` header, which
 * makes Vercel regenerate that ISR cache entry from fresh data. We respond
 * immediately and run the (throttled) regenerations in the background via
 * waitUntil, so a slow fan-out never makes the caller time out.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const { token, paths } = await request.json().catch(() => ({}))

	if (!token || token !== ISR_BYPASS_TOKEN) {
		return json({ error: 'Invalid token' }, { status: 401 })
	}

	if (!Array.isArray(paths) || paths.length === 0) {
		return json({ error: 'No paths provided' }, { status: 400 })
	}

	// Normalise to SvelteKit's canonical no-trailing-slash form (a trailing slash
	// 308-redirects, and Vercel won't revalidate across a redirect), and expand
	// each path to both the page HTML and its `__data.json` (separate ISR
	// entries — HTML for full loads, data for client-side navigation).
	const normalize = (p: string) => (p === '/' ? '/' : p.replace(/\/+$/, ''))
	const dataPath = (p: string) => `${p === '/' ? '' : p}/__data.json`
	const targets = paths.flatMap((p: string) => {
		const clean = normalize(p)
		return [clean, dataPath(clean)]
	})

	const work = pool(targets, CONCURRENCY, (path) =>
		fetch(new URL(path, PUBLIC_SITE_URL).toString(), {
			headers: { 'x-prerender-revalidate': ISR_BYPASS_TOKEN }
		})
	)

	// Respond now; keep the function alive for the regenerations. waitUntil is
	// present on Vercel; locally (dev) it isn't, so just await there.
	const ctx = (platform as { context?: { waitUntil?: (p: Promise<unknown>) => void } } | undefined)?.context
	if (ctx?.waitUntil) {
		ctx.waitUntil(work)
	} else {
		await work
	}

	return json({ revalidating: targets })
}
