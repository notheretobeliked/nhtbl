import { PUBLIC_SITE_URL } from '$env/static/public'
import { fetchPublishedContent, indexable } from '$lib/server/content-index'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	const siteUrl = PUBLIC_SITE_URL.replace(/\/$/, '')
	// Hidden pages (noindex) are still built, just not listed.
	const nodes = indexable(await fetchPublishedContent())

	const urls = nodes.map((node) => {
		const loc = `${siteUrl}${node.uri}`
		const lastmod = node.modifiedGmt
			? new Date(node.modifiedGmt + 'Z').toISOString().split('T')[0]
			: undefined

		return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`
	})

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	})
}

function escapeXml(str: string): string {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
