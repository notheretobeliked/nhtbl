import { urqlQuery } from '$lib/graphql/client'
import { extractProjectImages } from '$lib/utilities/imageExtractor'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

// Use the raw query string instead of generated document for debugging
const PROJECT_IMAGES_QUERY = `
  query ProjectImages {
    nhtblProjects(first: 100) {
      nodes {
        slug
        title
        uri
        nhtblClients {
          nodes {
            name
            slug
          }
        }
        nhtblServices {
          nodes {
            name
            slug
          }
        }
        editorBlocks {
          __typename
          name
          ...on CoreImage {
            colorPalette
            dominantColor
            secondaryColor
            altText
            mediaDetails {
              sizes {
                name
                sourceUrl
                width
                height
              }
            }
          }
        }
      }
    }
  }
`

export const GET: RequestHandler = async () => {
  try {
    const data = await urqlQuery(PROJECT_IMAGES_QUERY)
    
    if (!data?.nhtblProjects?.nodes) {
      return json({ images: [], projectsData: [], error: null })
    }

    const images = extractProjectImages(data.nhtblProjects.nodes)
    
    return json({ 
      images,
      projectsData: data.nhtblProjects.nodes,
      error: null
    })
  } catch (error) {
    console.error('Failed to fetch project images:', error)
    return json(
      { images: [], projectsData: [], error: `Failed to fetch images: ${error.message}` },
      { status: 500 }
    )
  }
}