import SitemapQuery from '$lib/graphql/query/sitemap.graphql?raw'
import { assertGraphQLSucceeded, checkResponse, graphqlQuery } from '$lib/utilities/graphql'

export interface IndexedContent {
	uri: string
	modifiedGmt: string | null
	/** Editor chose "hide from search engines" (Yoast > Advanced): build it, don't list it. */
	noindex: boolean
}

interface SitemapPage {
	contentNodes: {
		pageInfo: { hasNextPage: boolean; endCursor: string | null }
		nodes: Array<{ uri: string | null; modifiedGmt: string | null; noindex: boolean | null } | null>
	} | null
}

/** Hard stop against a backend that never reports the last page (100 × 100 items). */
const MAX_PAGES = 100

/**
 * Every published page and post, following the GraphQL cursor until the end.
 * Items without a URI (e.g. the posts page placeholder) are skipped.
 */
export async function fetchPublishedContent(): Promise<IndexedContent[]> {
	const items: IndexedContent[] = []
	let after: string | null = null

	for (let page = 0; page < MAX_PAGES; page++) {
		const response = await graphqlQuery(SitemapQuery, { after })
		checkResponse(response)

		const json = await response.json()
		assertGraphQLSucceeded(json, 'content index')

		const connection = (json.data as SitemapPage).contentNodes
		for (const node of connection?.nodes ?? []) {
			if (!node?.uri) continue
			items.push({
				uri: node.uri,
				modifiedGmt: node.modifiedGmt ?? null,
				noindex: node.noindex === true
			})
		}

		if (!connection?.pageInfo.hasNextPage || !connection.pageInfo.endCursor) break
		after = connection.pageInfo.endCursor
	}

	return items
}

/** Items that belong in the sitemap. */
export function indexable(items: IndexedContent[]): IndexedContent[] {
	return items.filter((item) => !item.noindex)
}

/** A WordPress URI ("/about/team/") as the catch-all route's `all` param ("about/team"). */
export function uriToParam(uri: string): string {
	return uri.replace(/^\/+|\/+$/g, '')
}
