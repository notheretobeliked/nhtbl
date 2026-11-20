import { describe, expect, it } from 'vitest'
import { briefAsText, briefMailto, briefSubject, CHANGE_OPTIONS, FINDINGS, NOTICE_OPTIONS, type Brief } from './brief'

const brief: Brief = {
	change: 'minds',
	notice: 'power',
	when: 'months',
	budget: 'none',
	more: 'The new road through our town',
	name: 'Sam',
	email: 'sam@example.org'
}

describe('contact widget options', () => {
	it('gives every option a reply', () => {
		for (const o of [...CHANGE_OPTIONS, ...NOTICE_OPTIONS]) expect(o.reply.length).toBeGreaterThan(5)
	})
	it('pairs a law or a policy with the finding about policy', () => {
		expect(CHANGE_OPTIONS.find((o) => o.id === 'policy')?.finding).toBe(FINDINGS.movements)
	})
	it('gives every finding a source link', () => {
		for (const f of Object.values(FINDINGS)) expect(f.url).toMatch(/^https:\/\//)
	})
})

describe('contact widget brief', () => {
	it('writes the answers out as a message', () => {
		const text = briefAsText(brief)
		expect(text).toContain('From: Sam <sam@example.org>')
		expect(text).toContain('By when? In the next few months')
		expect(text).toContain('Is there a budget? No, we’re volunteers')
		expect(text).toContain('What are you trying to change? What people think')
		expect(text).toContain('Who needs to notice? People in power')
		expect(text).toContain('The new road through our town')
	})
	it('makes a subject from the first answer and the name', () => {
		expect(briefSubject(brief)).toBe('Via the website: What people think (Sam)')
		expect(briefSubject({ ...brief, name: '' })).toBe('Via the website: What people think')
	})
	it('builds a mailto link that carries the brief', () => {
		const link = briefMailto(brief)
		expect(link.startsWith('mailto:welikeyou@nhtbl.studio?subject=')).toBe(true)
		expect(decodeURIComponent(link)).toContain('People in power')
	})
})
