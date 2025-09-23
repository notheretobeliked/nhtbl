import { dev } from '$app/environment'
import { urqlQuery } from '$lib/graphql/client'
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
export async function getAllProjects(): Promise<NonNullable<ProjectsQuery['nhtblProjects']>['nodes']> {
  const now = Date.now()
  
  // Check if cache is valid (not in dev and cache exists and not expired)
  if (!dev && projectsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('🎯 Using cached projects data')
    return projectsCache
  }
  
  console.log(dev ? '🔧 Dev mode: fetching fresh projects data' : '🔄 Cache expired: fetching fresh projects data')
  
  try {
    const data = await urqlQuery(Projects)
    projectsCache = data.nhtblProjects?.nodes || []
    cacheTimestamp = now
    
    console.log(`📦 Cached ${projectsCache.length} projects`)
    return projectsCache
  } catch (error) {
    console.error('❌ Failed to fetch projects:', error)
    // Return cached data if available, otherwise throw
    if (projectsCache) {
      console.log('⚠️ Using stale cache due to fetch error')
      return projectsCache
    }
    throw error
  }
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export function clearProjectsCache(): void {
  projectsCache = null
  cacheTimestamp = 0
  console.log('🗑️ Projects cache cleared')
}
