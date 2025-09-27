<script lang="ts">
  import { onMount } from 'svelte'
  import FeaturedProject from '$components/molecules/FeaturedProject.svelte'
  import Masonry from 'svelte-bricks'
  import type { AcfPortfolioBlock, ProjectsQuery } from '$lib/graphql/generated'
  import { getDisplayMode } from '$lib/utilities/portfolioResolver'

  interface Props {
    block: AcfPortfolioBlock & {
      resolvedProjects?: NonNullable<ProjectsQuery['nhtblProjects']>['nodes']
    }
  }

  let { block }: Props = $props()



  const projects = $derived(block.resolvedProjects ?? [])
  const config = $derived(block.portfolioBlock)
  const displayMode = $derived(config ? getDisplayMode(config) : 'horizontal_scroll')
  const enableSearch = $derived(config?.enableSearch ?? false)
  const alignmentClass = $derived(block.attributes?.align === 'full' ? 'alignfull' : 'alignwide')

 
  // Search functionality (only if enabled)
  let searchTerm = $state('')
  let viewMode = $state<'horizontal_scroll' | 'masonry' | 'list'>(displayMode)

  // Function to handle service tag clicks from child components
  const handleServiceClick = (serviceName: string) => {
    if (enableSearch) {
      searchTerm = serviceName
    }
  }

  let filteredProjects = $derived.by(() => {
    if (!enableSearch || !searchTerm.trim()) {
      return projects
    }

    const searchLower = searchTerm.toLowerCase()
    return projects.filter((project: any) => {
      // Search in title
      const titleMatch = project.title?.toLowerCase().includes(searchLower)

      // Search in excerpt (strip HTML tags)
      const excerptText = project.excerpt?.replace(/<[^>]*>/g, '') || ''
      const excerptMatch = excerptText.toLowerCase().includes(searchLower)

      // Search in clients
      const clientMatch = project.nhtblClients?.nodes?.some((client: any) => client?.name?.toLowerCase().includes(searchLower))

      // Search in services
      const serviceMatch = project.nhtblServices?.nodes?.some((service: any) => service?.name?.toLowerCase().includes(searchLower))

      return titleMatch || excerptMatch || clientMatch || serviceMatch
    })
  })

  // Masonry settings
  let minColWidth = $state(300)
  let maxColWidth = $state(600)
  let gap = $state(30)

  onMount(() => {
    const updateColWidth = () => {
      minColWidth = window.innerWidth >= 768 ? 300 : 120
    }

    updateColWidth()
    window.addEventListener('resize', updateColWidth)

    return () => {
      window.removeEventListener('resize', updateColWidth)
    }
  })
</script>

{#if enableSearch}
  <!-- Portfolio Controls (only show when search is enabled) -->
  <div class="portfolio-controls {alignmentClass} mb-8 sticky top-24 w-full z-10">
    <!-- View Mode Toggle Buttons -->
    <div class="flex items-center gap-4 justify-between mb-6">
      <!-- Search Box -->
      <div class="relative w-full">
        <div class="absolute inset-y-0 z-10 left-0 pl-3 flex items-center pointer-events-none">
          <!-- Search Icon SVG -->
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="white">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          bind:value={searchTerm}
          placeholder="Search projects by title, client, service, or description..."
          class="w-full pl-10 pr-12 py-3  bg-white/60 rounded-full backdrop-blur-md border-none focus:outline-none transition-colors text-white placeholder-white/50"
        />
        {#if searchTerm}
          <div class="absolute inset-y-0 right-0 flex flex-row items-center">
            <p class="text-black/30 pr-3 text-sm">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </p>
            <button onclick={() => (searchTerm = '')} class="pr-3 flex items-center text-gray-400 hover:text-white transition-colors" aria-label="Clear search">
              <!-- X Icon SVG -->
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="black">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        {/if}
      </div>
      <div class="flex gap-2">
        <button
          onclick={() => (viewMode = 'list')}
          class="p-3 rounded-full border transition-colors {viewMode === 'list'
            ? 'bg-white text-black border-white'
            : 'bg-transparent text-white border-gray-600 hover:border-white'}"
          aria-label="List view"
        >
          <!-- List Icon SVG -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18m-18 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
        <button
          onclick={() => (viewMode = 'masonry')}
          class="p-3 rounded-full border transition-colors {viewMode === 'masonry'
            ? 'bg-white text-black border-white'
            : 'bg-transparent text-white border-gray-600 hover:border-white'}"
          aria-label="Masonry view"
        >
          <!-- Masonry Grid Icon SVG -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="8" height="6" stroke="currentColor" stroke-width="2" fill="none" />
            <rect x="13" y="3" width="8" height="8" stroke="currentColor" stroke-width="2" fill="none" />
            <rect x="3" y="11" width="8" height="10" stroke="currentColor" stroke-width="2" fill="none" />
            <rect x="13" y="13" width="8" height="8" stroke="currentColor" stroke-width="2" fill="none" />
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Debug display -->

<!-- Display based on mode -->
{#if viewMode === 'horizontal_scroll'}
  <!-- Horizontal Scroll (original carousel) -->
  <div class="portfolio-carousel horizontal-gallery {alignmentClass} relative overflow-hidden">
    <div class="cards-container flex gap-4 overflow-x-auto pb-4">
      {#each filteredProjects as project (project.slug)}
        <div class="flex-shrink-0 w-80">
          <FeaturedProject displayMode="block" {project} {enableSearch} onServiceClick={handleServiceClick} />
        </div>
      {/each}
    </div>
  </div>
{:else if viewMode === 'masonry'}
  <!-- Masonry Layout -->
  <div class="portfolio-masonry my-16 full-width-breakout">
    {#if filteredProjects.length > 0}
      <Masonry items={filteredProjects} {minColWidth} {maxColWidth} {gap} idKey="slug" let:item animate>
        <FeaturedProject displayMode="masonryBlock" project={item} {enableSearch} onServiceClick={handleServiceClick} />
      </Masonry>
    {:else}
      <div class="text-center py-12 {alignmentClass}">
        <p class="text-gray-600">No projects found.</p>
      </div>
    {/if}
  </div>
{:else if viewMode === 'list'}
  <!-- List Layout -->
  <div class="portfolio-list {alignmentClass} my-8">
    <div class="space-y-5">
      {#each filteredProjects as project (project.slug)}
        <FeaturedProject displayMode="grid" {project} {enableSearch} onServiceClick={handleServiceClick} />
      {/each}
    </div>

    {#if filteredProjects.length === 0}
      <div class="text-center py-12">
        <p class="text-gray-600">No projects found.</p>
      </div>
    {/if}
  </div>
{/if}

<style>
  .cards-container {
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
  }

  .cards-container::-webkit-scrollbar {
    height: 8px;
  }

  .cards-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .cards-container::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }

  .cards-container::-webkit-scrollbar-thumb:hover {
    background-color: #999;
  }
  .full-width-breakout {
    @apply px-2 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw];
  }

  /* Ensure the masonry container takes full width */
  .full-width-breakout :global(.masonry-container) {
    width: 100% !important;
  }
</style>
