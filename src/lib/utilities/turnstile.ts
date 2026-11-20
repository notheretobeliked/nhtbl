// Cloudflare Turnstile (invisible widget) for the newsletter form: proves a
// signup comes from a real browser without showing anything. The script is only
// loaded when someone starts using a form, never on plain page views.
//
// Browser only. The server checks the resulting token in /api/subscribe.

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const TIMEOUT_MS = 20_000

interface TurnstileApi {
	render: (el: HTMLElement, options: Record<string, unknown>) => string
	remove: (widgetId: string) => void
}

let scriptPromise: Promise<TurnstileApi> | null = null

/** Load the Turnstile script once. Safe to call early (e.g. on focus) to warm up. */
export function loadTurnstile(): Promise<TurnstileApi> {
	if (scriptPromise) return scriptPromise
	scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
		const existing = (window as any).turnstile as TurnstileApi | undefined
		if (existing) return resolve(existing)
		const script = document.createElement('script')
		script.src = SCRIPT_SRC
		script.async = true
		script.onload = () => {
			const api = (window as any).turnstile as TurnstileApi | undefined
			if (api) resolve(api)
			else reject(new Error('Turnstile did not initialise'))
		}
		script.onerror = () => reject(new Error('Turnstile script failed to load'))
		document.head.appendChild(script)
	})
	// A failed load (offline, blocked) shouldn't be remembered: let the next try reload.
	scriptPromise.catch(() => (scriptPromise = null))
	return scriptPromise
}

/**
 * Run one invisible check and resolve with a single-use token. Rejects if the
 * script is blocked, the check fails, or it takes too long.
 */
export async function getTurnstileToken(siteKey: string): Promise<string> {
	const api = await loadTurnstile()
	const holder = document.createElement('div')
	document.body.appendChild(holder)

	let widgetId: string | undefined
	try {
		return await new Promise<string>((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error('Turnstile timed out')), TIMEOUT_MS)
			const settle = (fn: () => void) => {
				clearTimeout(timer)
				fn()
			}
			widgetId = api.render(holder, {
				sitekey: siteKey,
				action: 'newsletter',
				callback: (token: string) => settle(() => resolve(token)),
				'error-callback': (code: unknown) => {
					settle(() => reject(new Error(`Turnstile error ${code}`)))
					return true // handled: stops Turnstile logging its own console error
				},
				'timeout-callback': () => settle(() => reject(new Error('Turnstile timed out')))
			})
		})
	} finally {
		if (widgetId) {
			try {
				api.remove(widgetId)
			} catch {
				// already gone
			}
		}
		holder.remove()
	}
}
