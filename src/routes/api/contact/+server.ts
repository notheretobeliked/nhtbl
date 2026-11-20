import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'
import { verifyTurnstile } from '$lib/server/turnstile'
import {
	BUDGET_OPTIONS,
	briefAsText,
	briefSubject,
	CONTACT_EMAIL,
	WHEN_OPTIONS,
	type Brief
} from '$lib/contact/brief'

// The contact widget's messages → our inbox, sent through Brevo. Configured by
// env (see .env.example):
//   BREVO_API_KEY         required
//   CONTACT_FROM_EMAIL    required – a sender address verified in Brevo
//   CONTACT_TO_EMAIL      optional – where messages go (default: the studio address)
//   TURNSTILE_SECRET_KEY  optional – when set, messages need a valid Turnstile token
// Without the first two this answers 503 with `fallback: true`, and the widget
// offers the visitor an email link carrying their answers instead.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export const POST: RequestHandler = async ({ request }) => {
	const apiKey = env.BREVO_API_KEY
	const from = env.CONTACT_FROM_EMAIL
	if (!apiKey || !from) {
		return json({ ok: false, fallback: true, error: 'Sending isn’t set up yet.' }, { status: 503 })
	}

	let body: Record<string, unknown>
	try {
		body = await request.json()
	} catch {
		return json({ ok: false, error: 'Invalid request.' }, { status: 400 })
	}

	// Honeypot: real visitors never see or fill this field. Pretend it worked.
	if (typeof body.website === 'string' && body.website.trim()) {
		return json({ ok: true })
	}

	const turnstileSecret = env.TURNSTILE_SECRET_KEY
	if (turnstileSecret) {
		const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : ''
		if (!token || token.length > 2048 || !(await verifyTurnstile(token, turnstileSecret))) {
			return json(
				{ ok: false, fallback: true, error: 'We couldn’t check that you’re not a robot.' },
				{ status: 403 }
			)
		}
	}

	const when = WHEN_OPTIONS.find((o) => o.id === body.when)?.id ?? ''
	const budget = BUDGET_OPTIONS.find((o) => o.id === body.budget)?.id ?? ''
	const brief: Brief = {
		change: text(body.change, 2000),
		notice: text(body.notice, 2000),
		when,
		budget,
		more: text(body.more, 4000),
		// A name goes into an email header: one line only.
		name: text(body.name, 120).replace(/[\r\n]+/g, ' '),
		email: text(body.email, 254).toLowerCase()
	}
	if (!EMAIL_RE.test(brief.email)) {
		return json({ ok: false, error: 'That email address doesn’t look right.' }, { status: 400 })
	}
	if (!brief.change) {
		return json({ ok: false, error: 'Tell us what you’re trying to change.' }, { status: 400 })
	}

	try {
		const res = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
			body: JSON.stringify({
				sender: { email: from, name: 'Not here to be liked website' },
				to: [{ email: env.CONTACT_TO_EMAIL || CONTACT_EMAIL }],
				// Replying goes to the person who wrote, not to the website's sender address.
				replyTo: { email: brief.email, ...(brief.name ? { name: brief.name } : {}) },
				subject: briefSubject(brief),
				textContent: briefAsText(brief)
			})
		})
		if (!res.ok) {
			console.error('Brevo refused a contact message:', res.status, await res.text().catch(() => ''))
			return json({ ok: false, fallback: true, error: 'We couldn’t send that.' }, { status: 502 })
		}
	} catch (err) {
		console.error('Sending a contact message failed:', err)
		return json({ ok: false, fallback: true, error: 'We couldn’t send that.' }, { status: 502 })
	}
	return json({ ok: true })
}
