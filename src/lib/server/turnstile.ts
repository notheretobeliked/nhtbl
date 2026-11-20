/** Ask Cloudflare whether a Turnstile token is genuine. Any failure counts as no. */
export async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
	try {
		const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			body: new URLSearchParams({ secret, response: token })
		})
		const data = await res.json()
		if (!data?.success) console.error('Turnstile rejected a request:', data?.['error-codes'])
		return data?.success === true
	} catch (err) {
		console.error('Turnstile verification failed:', err)
		return false
	}
}
