// Runs on Vercel's default Node runtime — Edge can't bundle the server's
// node:crypto dependency, and a proxy gains little from the edge anyway.

// Proxy Plausible events through our own domain (avoids ad-blockers).
export async function POST({ request, fetch }) {
	return fetch('https://plausible.io/api/event', {
		method: 'POST',
		headers: request.headers,
		body: request.body,
		// @ts-expect-error - required when streaming a request body
		duplex: 'half'
	})
}
