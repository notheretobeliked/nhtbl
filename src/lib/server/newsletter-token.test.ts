import { describe, expect, it } from 'vitest'
import { NAME_TOKEN_TTL_MS, cleanName, createNameToken, verifyNameToken } from './newsletter-token'

const SECRET = 'test-secret'
const NOW = 1_800_000_000_000

describe('name token', () => {
	it('accepts a fresh token for the address it was issued for', () => {
		const token = createNameToken('Someone@Example.org', SECRET, NOW)
		expect(verifyNameToken('someone@example.org ', token, SECRET, NOW + 1000)).toBe(true)
	})

	it('rejects a token used for a different address', () => {
		const token = createNameToken('someone@example.org', SECRET, NOW)
		expect(verifyNameToken('other@example.org', token, SECRET, NOW)).toBe(false)
	})

	it('rejects an expired token', () => {
		const token = createNameToken('someone@example.org', SECRET, NOW)
		expect(verifyNameToken('someone@example.org', token, SECRET, NOW + NAME_TOKEN_TTL_MS + 1)).toBe(false)
	})

	it('rejects a token signed with another secret, a tampered expiry, and junk', () => {
		const token = createNameToken('someone@example.org', SECRET, NOW)
		expect(verifyNameToken('someone@example.org', token, 'other-secret', NOW)).toBe(false)
		const [, signature] = token.split('.')
		const later = (NOW + NAME_TOKEN_TTL_MS * 10).toString(36)
		expect(verifyNameToken('someone@example.org', `${later}.${signature}`, SECRET, NOW)).toBe(false)
		for (const junk of [undefined, null, '', 'abc', 'abc.', '.abc', 42]) {
			expect(verifyNameToken('someone@example.org', junk, SECRET, NOW)).toBe(false)
		}
	})
})

describe('cleanName', () => {
	it('trims, collapses whitespace, drops control characters and caps the length', () => {
		expect(cleanName('  Moa \n Pårup\t')).toBe('Moa Pårup')
		expect(cleanName('x'.repeat(200))).toHaveLength(80)
		expect(cleanName(undefined)).toBe('')
	})
})
