/**
 * Re-wrap a proxied response for the browser. `fetch` has already
 * decompressed the body, so the upstream content-encoding and length no
 * longer describe it: passing them on makes browsers fail to decode it.
 * @param {Response} res
 */
export function passThrough(res) {
	const headers = new Headers(res.headers)
	headers.delete('content-encoding')
	headers.delete('content-length')
	return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
}
