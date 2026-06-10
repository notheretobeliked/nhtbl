export const config = {
	// Vercel: run at the edge.
	runtime: 'edge'
}

// Proxy the Plausible script through our own domain (avoids ad-blockers).
export function GET({ fetch }) {
	return fetch('https://plausible.io/js/script.js')
}
