// Runs on Vercel's default Node runtime (see the event proxy for why).
import { passThrough } from '$lib/server/passThrough.js'

// Proxy the Plausible script through our own domain (avoids ad-blockers).
export async function GET({ fetch }) {
	return passThrough(await fetch('https://plausible.io/js/script.js'))
}
