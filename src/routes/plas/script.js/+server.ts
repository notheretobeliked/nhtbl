import type { RequestHandler } from './$types'
import { passThrough } from '$lib/server/plausible'

// Serve Plausible's script from our own origin.
export const GET: RequestHandler = async ({ fetch }) => passThrough(await fetch('https://plausible.io/js/script.js'))
