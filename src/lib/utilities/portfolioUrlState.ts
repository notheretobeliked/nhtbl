/**
 * The work list's filters as a shareable query string, e.g.
 *   /portfolio?filter=website&view=list
 *   /portfolio?filter=exhibition&q=climate
 *
 *   filter   the one active filter: service and/or type slugs (a statement
 *            term can cover several, e.g. posters,printed-matter)
 *   q        the search text
 *   view     grid | list | gallery (omitted when it's the block's default)
 */
export type PortfolioView = 'grid' | 'list' | 'gallery'

export interface PortfolioUrlState {
	filter: string[]
	q: string
	view: PortfolioView | null
}

const KEYS = ['filter', 'q', 'view'] as const
const VIEWS: PortfolioView[] = ['grid', 'list', 'gallery']

const splitSlugs = (value: string | null): string[] =>
	(value ?? '')
		.split(',')
		.map((slug) => slug.trim().toLowerCase())
		.filter(Boolean)

/** Parse a location.search string. Returns null when it carries none of our params. */
export function readPortfolioUrlState(search: string): PortfolioUrlState | null {
	const params = new URLSearchParams(search)
	if (!KEYS.some((key) => params.has(key))) return null
	const view = params.get('view')
	return {
		filter: splitSlugs(params.get('filter')),
		q: params.get('q') ?? '',
		view: VIEWS.includes(view as PortfolioView) ? (view as PortfolioView) : null
	}
}

/**
 * Write the state into a search string, leaving any unrelated params alone.
 * Returns '' or a string starting with '?'. Commas are kept readable.
 */
export function writePortfolioUrlState(search: string, state: PortfolioUrlState): string {
	const params = new URLSearchParams(search)
	for (const key of KEYS) params.delete(key)
	if (state.filter.length) params.set('filter', state.filter.join(','))
	if (state.q.trim()) params.set('q', state.q.trim())
	if (state.view) params.set('view', state.view)
	const out = params.toString().replace(/%2C/gi, ',')
	return out ? `?${out}` : ''
}
