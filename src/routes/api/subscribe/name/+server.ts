import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'
import { cleanName, verifyNameToken } from '$lib/server/newsletter-token'

// Optional second step of the newsletter signup: add a first and last name to
// the address that was just signed up. Only accepted with the pass issued by
// /api/subscribe for that address.
//
// With double opt-in, Brevo may not have created the contact yet (it does so
// when the confirmation link is clicked), so this creates the contact with the
// name if it's missing and updates it if it's there. It is not added to any
// list here — confirming does that.
export const POST: RequestHandler = async ({ request }) => {
	const apiKey = env.BREVO_API_KEY
	if (!apiKey) {
		return json({ ok: false, error: 'Signups are not set up yet.' }, { status: 503 })
	}

	let body: { email?: unknown; nameToken?: unknown; firstName?: unknown; lastName?: unknown }
	try {
		body = await request.json()
	} catch {
		return json({ ok: false, error: 'Invalid request.' }, { status: 400 })
	}

	const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
	if (!email || !verifyNameToken(email, body.nameToken, apiKey)) {
		return json(
			{ ok: false, error: 'That took a little too long. Your signup is safe, though.' },
			{ status: 403 }
		)
	}

	const firstName = cleanName(body.firstName)
	const lastName = cleanName(body.lastName)
	if (!firstName && !lastName) {
		return json({ ok: false, error: 'Add a name, or choose “No thanks”.' }, { status: 400 })
	}

	const attributes: Record<string, string> = {}
	if (firstName) attributes.FIRSTNAME = firstName
	if (lastName) attributes.LASTNAME = lastName

	try {
		// Anyone can sign up any address, so the pass doesn't prove the address is
		// theirs. Never overwrite a name that's already there: a stranger must not
		// be able to rename an existing subscriber. The answer is the same either
		// way, so this doesn't reveal who is on the list.
		const existing = await fetch(
			`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}?identifierType=email_id`,
			{ headers: { 'api-key': apiKey, accept: 'application/json' } }
		)
		if (existing.ok) {
			const contact = await existing.json()
			const has = (v: unknown) => typeof v === 'string' && v.trim() !== ''
			if (has(contact?.attributes?.FIRSTNAME) || has(contact?.attributes?.LASTNAME)) {
				return json({ ok: true })
			}
		} else if (existing.status !== 404) {
			// Can't tell whether a name exists: don't risk overwriting one.
			console.error('Brevo contact lookup failed:', existing.status, await existing.text())
			return json(
				{ ok: false, error: 'We couldn’t save your name. Your signup is safe, though.' },
				{ status: 502 }
			)
		}

		const res = await fetch('https://api.brevo.com/v3/contacts', {
			method: 'POST',
			headers: {
				'api-key': apiKey,
				'content-type': 'application/json',
				accept: 'application/json'
			},
			body: JSON.stringify({ email, attributes, updateEnabled: true })
		})
		if (!res.ok) {
			console.error('Brevo name update failed:', res.status, await res.text())
			return json(
				{ ok: false, error: 'We couldn’t save your name. Your signup is safe, though.' },
				{ status: 502 }
			)
		}
		return json({ ok: true })
	} catch (err) {
		console.error('Brevo name update failed:', err)
		return json(
			{ ok: false, error: 'We couldn’t save your name. Your signup is safe, though.' },
			{ status: 502 }
		)
	}
}
