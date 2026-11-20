import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * A short-lived pass that lets the browser which just signed an address up add
 * a name to that same address — and nothing else. Without it, the name endpoint
 * would let anyone overwrite the name of any subscriber whose email they know.
 *
 * Format: "<expiry ms, base36>.<hmac of email + expiry>". Stateless: nothing is
 * stored, the signature is simply recomputed on the way back in.
 */
export const NAME_TOKEN_TTL_MS = 30 * 60 * 1000

const normalise = (email: string) => email.trim().toLowerCase()

const sign = (email: string, expires: number, secret: string) =>
	createHmac('sha256', `nhtbl-newsletter-name:${secret}`)
		.update(`${normalise(email)}|${expires}`)
		.digest('base64url')

export function createNameToken(email: string, secret: string, now = Date.now()): string {
	const expires = now + NAME_TOKEN_TTL_MS
	return `${expires.toString(36)}.${sign(email, expires, secret)}`
}

export function verifyNameToken(
	email: string,
	token: unknown,
	secret: string,
	now = Date.now()
): boolean {
	if (typeof token !== 'string' || !secret) return false
	const [expiryPart, signature] = token.split('.')
	if (!expiryPart || !signature) return false
	const expires = parseInt(expiryPart, 36)
	if (!Number.isFinite(expires) || expires < now) return false
	const expected = Buffer.from(sign(email, expires, secret))
	const given = Buffer.from(signature)
	return expected.length === given.length && timingSafeEqual(expected, given)
}

/** A name as typed: trimmed, control characters removed, capped in length. */
export function cleanName(value: unknown): string {
	if (typeof value !== 'string') return ''
	// eslint-disable-next-line no-control-regex
	return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)
}
