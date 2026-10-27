import type { RequestHandler } from './$types'
import { passThrough } from '$lib/server/plausible'

// Forward Plausible events through our origin.
export const POST: RequestHandler = async ({ request, fetch, getClientAddress }) => {
	const upstream = await fetch('https://plausible.io/api/event', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'user-agent': request.headers.get('user-agent') ?? '',
			// Plausible needs the visitor's IP to count unique visitors; without
			// it every event comes from the server and gets merged (or dropped).
			'x-forwarded-for': getClientAddress()
		},
		body: await request.text()
	})
	return passThrough(upstream)
}
