import { describe, expect, it } from 'vitest'
import { readPortfolioUrlState, writePortfolioUrlState } from './portfolioUrlState'

describe('readPortfolioUrlState', () => {
	it('returns null when none of the list params are present', () => {
		expect(readPortfolioUrlState('')).toBeNull()
		expect(readPortfolioUrlState('?utm_source=newsletter')).toBeNull()
	})

	it('parses slugs, search text and view', () => {
		expect(readPortfolioUrlState('?filter=Posters,printed-matter&q=climate%20fund&view=list')).toEqual({
			filter: ['posters', 'printed-matter'],
			q: 'climate fund',
			view: 'list'
		})
	})

	it('ignores an unknown view', () => {
		expect(readPortfolioUrlState('?view=carousel')?.view).toBeNull()
	})
})

describe('writePortfolioUrlState', () => {
	const empty = { filter: [], q: '', view: null }

	it('writes nothing for the default state', () => {
		expect(writePortfolioUrlState('', empty)).toBe('')
	})

	it('keeps commas readable and unrelated params intact', () => {
		expect(
			writePortfolioUrlState('?utm_source=newsletter&filter=old', {
				...empty,
				filter: ['posters', 'printed-matter'],
				view: 'list'
			})
		).toBe('?utm_source=newsletter&filter=posters,printed-matter&view=list')
	})

	it('round-trips through read', () => {
		const state = { filter: ['website'], q: 'heat strike', view: 'gallery' as const }
		expect(readPortfolioUrlState(writePortfolioUrlState('', state))).toEqual(state)
	})
})
