import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'
import { createNameToken } from '$lib/server/newsletter-token'

// Newsletter signup → Brevo. Configured by env (see .env.example):
//   BREVO_API_KEY          required
//   BREVO_LIST_ID          required – the list new subscribers join
//   BREVO_DOI_TEMPLATE_ID  optional – when set, Brevo sends a double opt-in
//                          confirmation email using this template instead of
//                          adding the contact straight to the list.
//   TURNSTILE_SECRET_KEY   optional – when set, signups need a valid Cloudflare
//                          Turnstile token (site key: PUBLIC_TURNSTILE_SITE_KEY).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Ask Cloudflare whether a Turnstile token is genuine. Any failure counts as no. */
async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
	try {
		const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			body: new URLSearchParams({ secret, response: token })
		})
		const data = await res.json()
		if (!data?.success) console.error('Turnstile rejected a signup:', data?.['error-codes'])
		return data?.success === true
	} catch (err) {
		console.error('Turnstile verification failed:', err)
		return false
	}
}

export const POST: RequestHandler = async ({ request, url }) => {
	const apiKey = env.BREVO_API_KEY
	const listId = Number(env.BREVO_LIST_ID)
	if (!apiKey || !listId) {
		return json({ ok: false, error: 'Signups are not set up yet.' }, { status: 503 })
	}

	let body: { email?: unknown; website?: unknown; turnstileToken?: unknown }
	try {
		body = await request.json()
	} catch {
		return json({ ok: false, error: 'Invalid request.' }, { status: 400 })
	}

	// Honeypot: real visitors never see or fill this field. Pretend it worked.
	if (typeof body.website === 'string' && body.website.trim()) {
		return json({ ok: true, confirm: false })
	}

	// Bot check: with a Turnstile secret configured, every signup must carry a
	// token that Cloudflare confirms. Without the secret the check is off.
	const turnstileSecret = env.TURNSTILE_SECRET_KEY
	if (turnstileSecret) {
		const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : ''
		if (!token || token.length > 2048 || !(await verifyTurnstile(token, turnstileSecret))) {
			return json(
				{
					ok: false,
					error: 'We couldn’t check that you’re not a robot. Please try again, or email us.'
				},
				{ status: 403 }
			)
		}
	}

	const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
	if (!EMAIL_RE.test(email) || email.length > 254) {
		return json({ ok: false, error: 'That email address doesn’t look right.' }, { status: 400 })
	}

	const doiTemplateId = Number(env.BREVO_DOI_TEMPLATE_ID)
	const endpoint = doiTemplateId
		? 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation'
		: 'https://api.brevo.com/v3/contacts'
	const payload = doiTemplateId
		? {
				email,
				includeListIds: [listId],
				templateId: doiTemplateId,
				redirectionUrl: `${url.origin}/?subscribed=1`
			}
		: { email, listIds: [listId], updateEnabled: true }

	try {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'api-key': apiKey,
				'content-type': 'application/json',
				accept: 'application/json'
			},
			body: JSON.stringify(payload)
		})
		if (!res.ok) {
			console.error('Brevo signup failed:', res.status, await res.text())
			return json(
				{ ok: false, error: 'Something went wrong. Please try again, or email us.' },
				{ status: 502 }
			)
		}
		// The pass lets this browser add a name to this address afterwards (see
		// ./name/+server.ts). It is signed with the Brevo key, which never leaves the server.
		return json({
			ok: true,
			confirm: Boolean(doiTemplateId),
			email,
			nameToken: createNameToken(email, apiKey)
		})
	} catch (err) {
		console.error('Brevo signup failed:', err)
		return json(
			{ ok: false, error: 'Something went wrong. Please try again, or email us.' },
			{ status: 502 }
		)
	}
}
