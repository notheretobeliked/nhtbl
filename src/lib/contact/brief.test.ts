import { describe, expect, it } from 'vitest'
import { briefAsText, briefMailto, briefSubject, FINDINGS, replyToChange, type Brief } from './brief'

const brief: Brief = {
	change: 'How people in our town think about the new road',
	notice: 'The county council',
	when: 'months',
	budget: 'none',
	more: '',
	name: 'Sam',
	email: 'sam@example.org'
}

describe('contact widget replies', () => {
	it('answers a climate campaign with the finding on protest and concern', () => {
		expect(replyToChange('We are planning a protest against new oil licences')).toBe(FINDINGS.concern)
		expect(replyToChange('The climate')).toBe(FINDINGS.concern)
	})
	it('answers any other campaign with the general finding, not a climate one', () => {
		expect(replyToChange('Organising a rent strike')).toBe(FINDINGS.movements)
	})
	it('answers an institution with the radical flank finding', () => {
		expect(replyToChange('How visitors see our museum collection')).toBe(FINDINGS.flank)
	})
	it('prefers the campaign reply when an institution is running one', () => {
		expect(replyToChange('Our charity is launching a climate campaign')).toBe(FINDINGS.concern)
	})
	it('falls back to the general finding', () => {
		expect(replyToChange('Everything')).toBe(FINDINGS.movements)
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
		expect(text).not.toContain('Anything else')
	})
	it('shortens a long first answer for the subject', () => {
		expect(briefSubject(brief)).toBe('Via the website: How people in our town think about the new road')
		expect(briefSubject({ ...brief, change: 'x'.repeat(100) }).length).toBeLessThanOrEqual(78)
	})
	it('builds a mailto link that carries the brief', () => {
		const link = briefMailto(brief)
		expect(link.startsWith('mailto:welikeyou@nhtbl.studio?subject=')).toBe(true)
		expect(decodeURIComponent(link)).toContain('The county council')
	})
})
