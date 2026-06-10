import ProjectImages from '$lib/graphql/query/project-images.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { extractProjectImages } from '$lib/utilities/imageExtractor'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { ProjectImagesQuery } from '$lib/graphql/generated'

export const GET: RequestHandler = async () => {
	try {
		const res = await graphqlQuery(ProjectImages)
		checkResponse(res)
		const body = await res.json()
		const data = body.data as ProjectImagesQuery
		const nodes = data?.nhtblProjects?.nodes

		if (!nodes) {
			return json({ images: [], projectsData: [], error: null })
		}

		const images = extractProjectImages(nodes)

		return json({
			images,
			projectsData: nodes,
			error: null
		})
	} catch (error) {
		console.error('Failed to fetch project images:', error)
		const message = error instanceof Error ? error.message : String(error)
		return json(
			{ images: [], projectsData: [], error: `Failed to fetch images: ${message}` },
			{ status: 500 }
		)
	}
}
