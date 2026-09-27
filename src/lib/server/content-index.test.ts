import { describe, it, expect, vi, beforeEach } from 'vitest'

const graphqlQuery = vi.fn()

vi.mock('$lib/utilities/graphql', () => ({
	graphqlQuery: (...args: unknown[]) => graphqlQuery(...args),
	checkResponse: () => {},
	assertGraphQLSucceeded: () => {}
}))

const { fetchPublishedContent, indexable, uriToParam } = await import('./content-index')

function page(nodes: unknown[], hasNextPage: boolean, endCursor: string | null = null) {
	return {
		json: async () => ({
			data: { contentNodes: { pageInfo: { hasNextPage, endCursor }, nodes } }
		})
	}
}

describe('fetchPublishedContent', () => {
	beforeEach(() => graphqlQuery.mockReset())

	it('follows the cursor across pages and maps noindex', async () => {
		graphqlQuery
			.mockResolvedValueOnce(
				page(
					[
						{ uri: '/', modifiedGmt: '2026-09-01T10:00:00', noindex: false },
						{ uri: '/hidden/', modifiedGmt: null, noindex: true }
					],
					true,
					'cursor-1'
				)
			)
			.mockResolvedValueOnce(
				page([{ uri: '/about/team/', modifiedGmt: '2026-09-02T10:00:00', noindex: null }], false)
			)

		const items = await fetchPublishedContent()

		expect(graphqlQuery).toHaveBeenCalledTimes(2)
		expect(graphqlQuery.mock.calls[0][1]).toEqual({ after: null })
		expect(graphqlQuery.mock.calls[1][1]).toEqual({ after: 'cursor-1' })
		expect(items).toEqual([
			{ uri: '/', modifiedGmt: '2026-09-01T10:00:00', noindex: false },
			{ uri: '/hidden/', modifiedGmt: null, noindex: true },
			{ uri: '/about/team/', modifiedGmt: '2026-09-02T10:00:00', noindex: false }
		])
	})

	it('skips items without a URI', async () => {
		graphqlQuery.mockResolvedValueOnce(
			page([null, { uri: null, modifiedGmt: null, noindex: false }, { uri: '/a/', modifiedGmt: null, noindex: false }], false)
		)

		expect((await fetchPublishedContent()).map((i) => i.uri)).toEqual(['/a/'])
	})

	it('stops when the backend reports more pages but no cursor', async () => {
		graphqlQuery.mockResolvedValue(page([{ uri: '/a/', modifiedGmt: null, noindex: false }], true, null))

		await fetchPublishedContent()
		expect(graphqlQuery).toHaveBeenCalledTimes(1)
	})
})

describe('indexable', () => {
	it('drops hidden (noindex) items only', () => {
		const items = [
			{ uri: '/', modifiedGmt: null, noindex: false },
			{ uri: '/hidden/', modifiedGmt: null, noindex: true }
		]
		expect(indexable(items).map((i) => i.uri)).toEqual(['/'])
	})
})

describe('uriToParam', () => {
	it('turns a WordPress URI into the catch-all param', () => {
		expect(uriToParam('/')).toBe('')
		expect(uriToParam('/about/')).toBe('about')
		expect(uriToParam('/about/team/')).toBe('about/team')
		expect(uriToParam('/2026/01/06/hello-world/')).toBe('2026/01/06/hello-world')
	})
})
