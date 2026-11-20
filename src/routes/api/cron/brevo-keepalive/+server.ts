import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'

// Monthly keep-alive for the Brevo API key (scheduled in vercel.json).
//
// Brevo expires a key after 90 consecutive days without use, and on a quiet
// site the signup form alone might not call it that often. This reads the
// newsletter list once a month, which counts as activity. If the key has
// stopped working it responds 502, so the failure shows in Vercel's cron logs.
//
// Vercel sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set;
// when it is, anything without that header is refused.
export const GET: RequestHandler = async ({ request }) => {
	const secret = env.CRON_SECRET
	if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
		return json({ ok: false, error: 'Unauthorized' }, { status: 401 })
	}

	const apiKey = env.BREVO_API_KEY
	const listId = Number(env.BREVO_LIST_ID)
	if (!apiKey || !listId) {
		return json({ ok: false, error: 'Brevo is not configured.' }, { status: 503 })
	}

	try {
		const res = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}`, {
			headers: { 'api-key': apiKey, accept: 'application/json' }
		})
		if (!res.ok) {
			console.error('Brevo keep-alive failed:', res.status, await res.text())
			return json({ ok: false, status: res.status }, { status: 502 })
		}
		return json({ ok: true })
	} catch (err) {
		console.error('Brevo keep-alive failed:', err)
		return json({ ok: false }, { status: 502 })
	}
}
