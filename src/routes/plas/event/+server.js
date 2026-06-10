export const config = {
	// Vercel: run at the edge so the proxied analytics call is fast.
	runtime: 'edge'
}

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
