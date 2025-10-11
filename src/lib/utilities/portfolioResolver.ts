import type { AcfPortfolioBlock, ProjectsQuery } from '$lib/graphql/generated'

type ProjectNode = NonNullable<ProjectsQuery['nhtblProjects']>['nodes'][number]
type PortfolioConfig = AcfPortfolioBlock['portfolioBlock']

/**
 * Resolve projects based on portfolio block configuration
 */
export const resolvePortfolioProjects = (
  config: PortfolioConfig,
  allProjects: ProjectNode[]
): ProjectNode[] => {
  if (!config) {
    return []
  }

  let resolvedProjects: ProjectNode[] = []

  switch (config.projectSource) {
    case 'specific':
      // Use the data that's already in specificProjects if it has full data
      if (config.specificProjects?.nodes) {
        const specificNodes = config.specificProjects.nodes
        
        // Check if the specific projects already have full data (title, excerpt, etc.)
        const hasFullData = specificNodes.length > 0 && 
          specificNodes[0]?.title && 
          specificNodes[0]?.excerpt !== undefined &&
          specificNodes[0]?.featuredImage
        
        if (hasFullData) {
          resolvedProjects = specificNodes as ProjectNode[]
        } else if (allProjects?.length) {
          // Fallback to matching by slug from allProjects
          resolvedProjects = specificNodes
            .map(specificProject => 
              allProjects.find(project => project.slug === specificProject.slug)
            )
            .filter((project): project is ProjectNode => project !== undefined)
        } else {
          resolvedProjects = []
        }
      }
      break

    case 'all':
      if (!allProjects?.length) {
        return []
      }
      resolvedProjects = [...allProjects]
      break

    case 'by_service':
      if (!allProjects?.length) {
        return []
      }
      if (config.selectedService?.nodes) {
        resolvedProjects = allProjects.filter(project =>
          project.nhtblServices?.nodes?.some(projectService =>
            config.selectedService?.nodes?.some(selectedService =>
              selectedService.slug === projectService.slug
            )
          )
        )
      }
      break

    default:
      resolvedProjects = []
  }

  // Apply sorting if specified
  if (config.sortOrder && resolvedProjects.length > 0) {
    resolvedProjects = applySorting(resolvedProjects, config.sortOrder)
  }

  // Apply limit if specified
  if (config.projectsPerPage && config.projectsPerPage > 0) {
    resolvedProjects = resolvedProjects.slice(0, config.projectsPerPage)
  }

  return resolvedProjects
}

/**
 * Apply sorting to projects
 */
const applySorting = (projects: ProjectNode[], sortOrder: string): ProjectNode[] => {
  const sorted = [...projects]

  switch (sortOrder) {
    case 'date_desc':
      return sorted.sort((a, b) => {
        const dateA = a.projectData?.startDate ? new Date(a.projectData.startDate).getTime() : 0
        const dateB = b.projectData?.startDate ? new Date(b.projectData.startDate).getTime() : 0
        return dateB - dateA
      })

    case 'date_asc':
      return sorted.sort((a, b) => {
        const dateA = a.projectData?.startDate ? new Date(a.projectData.startDate).getTime() : 0
        const dateB = b.projectData?.startDate ? new Date(b.projectData.startDate).getTime() : 0
        return dateA - dateB
      })

    case 'title_asc':
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))

    case 'title_desc':
      return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''))

    default:
      return sorted
  }
}

/**
 * Get display mode from configuration
 */
export const getDisplayMode = (config: PortfolioConfig): 'horizontal_scroll' | 'masonry' | 'list' => {
  const mode = config.displayMode?.[0]
  
  if (mode === 'horizontal_scroll' || mode === 'masonry' || mode === 'list') {
    return mode
  }
  
  // Default fallback
  return 'horizontal_scroll'
}
