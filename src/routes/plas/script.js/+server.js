// Runs on Vercel's default Node runtime (see the event proxy for why).

// Proxy the Plausible script through our own domain (avoids ad-blockers).
export function GET({ fetch }) {
	return fetch('https://plausible.io/js/script.js')
}
