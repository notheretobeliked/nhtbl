import { dev } from '$app/environment'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import Projects from '$lib/graphql/query/projects.graphql?raw'
import type { ProjectsQuery } from '$lib/graphql/generated'

// Global cache for projects
let projectsCache: NonNullable<ProjectsQuery['nhtblProjects']>['nodes'] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = dev ? 0 : 1000 * 60 * 30 // 30 minutes in prod, no cache in dev

/**
 * Get all projects with caching
 * In development: always fetches fresh data
 * In production: caches for 30 minutes
 */
export const getAllProjects = async (): Promise<NonNullable<ProjectsQuery['nhtblProjects']>['nodes']> => {
  const now = Date.now()
  
  // Check if cache is valid (not in dev and cache exists and not expired)
  if (!dev && projectsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return projectsCache
  }
  
  
  try {
    const res = await graphqlQuery(Projects)
    checkResponse(res)
    const json = await res.json()
    const data = json.data as ProjectsQuery
    projectsCache = data.nhtblProjects?.nodes || []
    cacheTimestamp = now
    
    return projectsCache
  } catch (error) {
    // Return cached data if available, otherwise throw
    if (projectsCache) {
      return projectsCache
    }
    throw error
  }
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export const clearProjectsCache = (): void => {
  projectsCache = null
  cacheTimestamp = 0
}
