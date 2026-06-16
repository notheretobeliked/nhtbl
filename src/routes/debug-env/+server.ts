import { env } from '$env/dynamic/private'
import { json } from '@sveltejs/kit'

// TEMPORARY debug route — delete after diagnosing CDN rewriting.
// These two values are not secrets (public URLs), safe to echo.
export const prerender = false

export function GET() {
	return json({
		CDN_URL: env.CDN_URL ?? null,
		WORDPRESS_URL: env.WORDPRESS_URL ?? null,
		cdnLen: (env.CDN_URL ?? '').length,
		wpLen: (env.WORDPRESS_URL ?? '').length
	})
}
