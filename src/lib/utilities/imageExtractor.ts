import type { ProjectImagesQuery, MediaItem } from '$lib/graphql/generated'

type ProjectNode = NonNullable<ProjectImagesQuery['nhtblProjects']>['nodes'][number]

export interface ProcessedImage {
  // Compatible with Image component (MediaItem structure)
  mediaDetails: {
    sizes: Array<{
      name: string
      sourceUrl: string
      width: string
      height: string
    }>
  }
  altText: string
  colorPalette?: Array<string | null>
  dominantColor?: string
  secondaryColor?: string
  
  // Project association
  projectSlug: string
  projectTitle: string
  projectUri: string
  
  // Additional properties to match MediaItem
  contentTypeName: string
  databaseId: number
  id: string
  isComment: boolean
  isTermNode: boolean
  slug: string
  uri: string
}

/**
 * Extract all images from project EditorBlocks and associate them with project info
 */
export const extractProjectImages = (
  projectsData: NonNullable<ProjectImagesQuery['nhtblProjects']>['nodes']
): ProcessedImage[] => {
  const allImages: ProcessedImage[] = []

  for (const project of projectsData) {
    if (!project.editorBlocks) continue

    // Extract CoreImage blocks - check both __typename and block name
    const imageBlocks = project.editorBlocks.filter(
      (block): block is any => 
        block?.__typename === 'CoreImage' || 
        block?.name === 'core/image' ||
        (block && 'mediaDetails' in block)
    )

    for (const imageBlock of imageBlocks) {
      // Skip if no media details (required for Image component)
      if (!imageBlock.mediaDetails?.sizes?.length) continue

      const processedImage: ProcessedImage = {
        // MediaItem compatible structure
        mediaDetails: {
          sizes: imageBlock.mediaDetails.sizes
            .filter((size): size is NonNullable<typeof size> => size !== null)
            .map(size => ({
              name: size.name ?? '',
              sourceUrl: size.sourceUrl ?? '',
              width: size.width ?? '',
              height: size.height ?? ''
            }))
        },
        altText: imageBlock.altText ?? '',
        colorPalette: imageBlock.colorPalette,
        dominantColor: imageBlock.dominantColor,
        secondaryColor: imageBlock.secondaryColor,
        
        // Project association
        projectSlug: project.slug ?? '',
        projectTitle: project.title ?? '',
        projectUri: project.uri ?? '',
        
        // Required MediaItem properties
        contentTypeName: 'attachment',
        databaseId: 0,
        id: `${project.slug}-${imageBlock.clientId || Math.random()}`,
        isComment: false,
        isTermNode: false,
        slug: '',
        uri: ''
      }

      allImages.push(processedImage)
    }
  }

  return allImages
}

/**
 * Filter images based on search term against associated project data
 */
export const filterImagesByProject = (
  images: ProcessedImage[],
  searchTerm: string,
  projectsData: ProjectNode[]
): ProcessedImage[] => {
  if (!searchTerm.trim()) return images

  const searchLower = searchTerm.toLowerCase()
  
  return images.filter(image => {
    // Find the associated project
    const project = projectsData.find(p => p.slug === image.projectSlug)
    if (!project) return false

    // Search in project title
    const titleMatch = project.title?.toLowerCase().includes(searchLower)

    // Search in clients
    const clientMatch = project.nhtblClients?.nodes?.some(client => 
      client?.name?.toLowerCase().includes(searchLower)
    )

    // Search in services
    const serviceMatch = project.nhtblServices?.nodes?.some(service => 
      service?.name?.toLowerCase().includes(searchLower)
    )

    // Search in image alt text
    const imageMatch = image.altText?.toLowerCase().includes(searchLower)

    return titleMatch || clientMatch || serviceMatch || imageMatch
  })
}

/**
 * Randomize array order ensuring no consecutive images from same project
 */
export const randomizeImages = (images: ProcessedImage[]): ProcessedImage[] => {
  if (images.length <= 1) return [...images]
  
  // Group images by project
  const imagesByProject = new Map<string, ProcessedImage[]>()
  for (const image of images) {
    if (!imagesByProject.has(image.projectSlug)) {
      imagesByProject.set(image.projectSlug, [])
    }
    imagesByProject.get(image.projectSlug)!.push(image)
  }
  
  // Shuffle images within each project
  for (const [_, projectImages] of imagesByProject) {
    for (let i = projectImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[projectImages[i], projectImages[j]] = [projectImages[j], projectImages[i]]
    }
  }
  
  const result: ProcessedImage[] = []
  const projectKeys = Array.from(imagesByProject.keys())
  
  // Create round-robin distribution
  let maxImagesPerProject = Math.max(...Array.from(imagesByProject.values()).map(arr => arr.length))
  
  for (let round = 0; round < maxImagesPerProject; round++) {
    // Shuffle project order for each round to avoid patterns
    const shuffledProjects = [...projectKeys]
    for (let i = shuffledProjects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledProjects[i], shuffledProjects[j]] = [shuffledProjects[j], shuffledProjects[i]]
    }
    
    for (const projectSlug of shuffledProjects) {
      const projectImages = imagesByProject.get(projectSlug)!
      if (projectImages.length > round) {
        result.push(projectImages[round])
      }
    }
  }
  
  return result
}