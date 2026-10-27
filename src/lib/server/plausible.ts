/**
 * Plausible, proxied through our own origin so ad-blockers don't block it.
 * On only when PUBLIC_PLAUSIBLE_DOMAIN is set (see the root layout).
 */

/**
 * Re-wrap an upstream response for the browser. Node's fetch has already
 * decoded the body, so the upstream content-encoding and length no longer
 * describe it: passed on, they make the browser fail to decode plain JS
 * (net::ERR_CONTENT_DECODING_FAILED).
 */
export function passThrough(upstream: Response): Response {
	const headers = new Headers(upstream.headers)
	headers.delete('content-encoding')
	headers.delete('content-length')
	return new Response(upstream.body, { status: upstream.status, headers })
}
