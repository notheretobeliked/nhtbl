<script lang="ts">
  import { onMount, untrack } from 'svelte'
  import FeaturedProject from '$components/molecules/FeaturedProject.svelte'
  import Image from '$components/atoms/Image.svelte'
  import ImageModal from '$components/molecules/ImageModal.svelte'
  import Masonry from 'svelte-bricks'
  import type { AcfPortfolioBlock, ProjectsQuery, ProjectImagesQuery } from '$lib/graphql/generated'
  import { getDisplayMode } from '$lib/utilities/portfolioResolver'
  import { filterImagesByProject, randomizeImages, type ProcessedImage } from '$lib/utilities/imageExtractor'

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
  const showTags = $derived((config as any)?.showTags ?? true)
  const alignmentClass = $derived(block.attributes?.align === 'full' ? 'alignfull' : 'alignwide')

  // Colour theming: drive the block's UI from its configured background/text
  // colours instead of hardcoded white-on-dark. Two roles — foreground (text)
  // and surface (background) — exposed as CSS vars and inherited by the items.
  // Defaults (#fff on #000) preserve the previous look when nothing is set.
  const PALETTE: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    'nhtbl-green-base': '#E0FF00',
    'nhtbl-grey-base': '#D9D9D9',
    'nhtbl-purple-base': '#D59CE5',
    'nhtbl-purple-light': '#E4D5E8'
  }
  function parseStyle(raw: unknown): Record<string, any> {
    if (!raw) return {}
    if (typeof raw === 'object') return raw as Record<string, any>
    try {
      return JSON.parse(String(raw))
    } catch {
      return {}
    }
  }
  function resolveColor(slug: unknown, customHex: unknown, fallback: string): string {
    if (typeof customHex === 'string' && customHex) return customHex
    if (typeof slug === 'string' && PALETTE[slug]) return PALETTE[slug]
    return fallback
  }
  const themeVars = $derived.by(() => {
    const style = parseStyle((block.attributes as any)?.style)
    const fg = resolveColor((block.attributes as any)?.textColor, style?.color?.text, '#FFFFFF')
    const bg = resolveColor((block.attributes as any)?.backgroundColor, style?.color?.background, '#000000')
    return (
      `--pf-fg:${fg};` +
      `--pf-bg:${bg};` +
      `--pf-muted:color-mix(in srgb, ${fg} 60%, transparent);` +
      `--pf-border:color-mix(in srgb, ${fg} 32%, transparent);` +
      `--pf-input:color-mix(in srgb, ${fg} 60%, transparent);` +
      `--pf-bg-muted:color-mix(in srgb, ${bg} 55%, transparent)`
    )
  })

 
  // Search functionality (only if enabled)
  let searchTerm = $state('')
  let debouncedSearchTerm = $state('')
  let searchTimeout: NodeJS.Timeout | null = null
  // Seed the view mode from the configured display mode once; the user can
  // change it afterwards via the toggles, so we only want the initial value.
  let viewMode = $state<'horizontal_scroll' | 'masonry' | 'list' | 'images'>(
    untrack(() => displayMode)
  )
  
  // Image gallery functionality
  let projectImagesData = $state<NonNullable<ProjectImagesQuery['nhtblProjects']>['nodes'] | null>(null)
  let isLoadingImages = $state(false)
  let allImages = $state<ProcessedImage[]>([])
  
  // Modal state
  let selectedImage = $state<ProcessedImage | null>(null)
  let isModalOpen = $state(false)

  // Clicking a service tag on a card toggles it in the same service filter as
  // the popup, so it shows up there as active and can be removed.
  const handleServiceClick = (serviceName: string) => {
    toggleService(serviceName)
  }

  // Debounce search term updates  
  $effect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // If search term is empty, update debounced term immediately
    if (!searchTerm.trim()) {
      debouncedSearchTerm = ''
      return
    }
    
    searchTimeout = setTimeout(() => {
      debouncedSearchTerm = searchTerm
    }, 300) // 300ms debounce
  })

  // Load images when switching to gallery view
  const loadProjectImages = async () => {
    if (projectImagesData || isLoadingImages) return
    
    isLoadingImages = true
    try {
      const response = await fetch('/api/project-images')
      const data = await response.json()
      
      if (data.error) {
        console.error('Failed to load project images:', data.error)
        return
      }
      
      projectImagesData = data.projectsData
      allImages = data.images
    } catch (error) {
      console.error('Failed to load project images:', error)
    } finally {
      isLoadingImages = false
    }
  }


  // Handle image click
  const handleImageClick = (image: ProcessedImage) => {
    selectedImage = image
    isModalOpen = true
  }

  // Handle modal close
  const handleModalClose = () => {
    isModalOpen = false
    selectedImage = null
  }

  // Store the initial randomized order
  let randomizedImages = $state<ProcessedImage[]>([])
  
  // Update randomized images when allImages changes (only on initial load)
  $effect(() => {
    if (allImages.length > 0 && randomizedImages.length === 0) {
      randomizedImages = randomizeImages(allImages)
    }
  })

  // Reactive state for displayed images based on search and filters
  const displayedImages = $derived.by(() => {
    if (!projectImagesData || viewMode !== 'images') return []
    
    // If search is active, filter from all images (no randomization to avoid sluggishness)
    if (enableSearch && debouncedSearchTerm.trim()) {
      return filterImagesByProject(allImages, debouncedSearchTerm, projectImagesData)
    }
    
    // If no search, use the pre-randomized images
    return randomizedImages
  })

  // Load images when switching to gallery view
  $effect(() => {
    if (viewMode === 'images' && !projectImagesData && !isLoadingImages) {
      loadProjectImages()
    }
  })

  // Service filter (popup): the unique child-service names across all listed
  // projects. Multiple can be selected; a project must offer ALL selected
  // services to remain in the list (AND).
  const isChildService = (s: any) => s?.parentId !== null && s?.parentId !== undefined
  let selectedServices = $state<string[]>([])
  let showServiceMenu = $state(false)

  // View-mode picker (grouped under one "Mode" button, popup like the filter).
  let showModeMenu = $state(false)
  // Carousel (horizontal_scroll) is only used for "featured projects" blocks, so
  // it isn't offered as a switchable view here.
  const VIEW_MODES = [
    { key: 'list', label: 'List' },
    { key: 'masonry', label: 'Grid' },
    { key: 'images', label: 'Gallery' }
  ] as const
  const currentModeLabel = $derived(VIEW_MODES.find((m) => m.key === viewMode)?.label ?? 'View')

  const toggleService = (svc: string) => {
    selectedServices = selectedServices.includes(svc)
      ? selectedServices.filter((s) => s !== svc)
      : [...selectedServices, svc]
  }

  const allServices = $derived.by(() => {
    const set = new Set<string>()
    for (const p of projects as any[]) {
      for (const s of p?.nhtblServices?.nodes ?? []) {
        if (isChildService(s) && s?.name) set.add(s.name)
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })

  let filteredProjects = $derived.by(() => {
    let result = projects as any[]

    // Filter to projects that offer EVERY selected service (AND).
    if (selectedServices.length > 0) {
      result = result.filter((project: any) => {
        const names = (project?.nhtblServices?.nodes ?? [])
          .filter(isChildService)
          .map((s: any) => s?.name)
        return selectedServices.every((sel) => names.includes(sel))
      })
    }

    // Then the free-text search.
    if (enableSearch && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter((project: any) => {
        const titleMatch = project.title?.toLowerCase().includes(searchLower)
        const excerptText = project.excerpt?.replace(/<[^>]*>/g, '') || ''
        const excerptMatch = excerptText.toLowerCase().includes(searchLower)
        const clientMatch = project.nhtblClients?.nodes?.some((client: any) =>
          client?.name?.toLowerCase().includes(searchLower)
        )
        const serviceMatch = project.nhtblServices?.nodes?.some((service: any) =>
          service?.name?.toLowerCase().includes(searchLower)
        )
        return titleMatch || excerptMatch || clientMatch || serviceMatch
      })
    }

    return result
  })

  // List-view column sorting. Click a header to sort by it; click again to flip
  // direction. Keeps the same grid template as FeaturedProject's grid mode so
  // the header aligns with the rows.
  type SortKey = 'year' | 'client'
  // Default to the project year, latest work first.
  let sortKey = $state<SortKey | null>('year')
  let sortDir = $state<'asc' | 'desc'>('desc')

  const sortValue = (project: any, key: SortKey): string | number => {
    switch (key) {
      case 'year': {
        const d = project.projectData?.startDate || project.projectData?.endDate
        return d ? new Date(d).getTime() : 0
      }
      case 'client':
        return (project.nhtblClients?.nodes?.[0]?.name ?? '').toLowerCase()
    }
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey = key
      sortDir = 'asc'
    }
  }

  const sortedProjects = $derived.by(() => {
    if (!sortKey) return filteredProjects
    const key = sortKey
    const dir = sortDir === 'asc' ? 1 : -1
    return [...filteredProjects].sort((a: any, b: any) => {
      const av = sortValue(a, key)
      const bv = sortValue(b, key)
      if (av < bv) return -dir
      if (av > bv) return dir
      return 0
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

  // Persist the view state (mode, search, service filter, sort) so navigating to
  // a project and back restores the same view instead of resetting on remount.
  // Keyed by page path + a hash of this block's config: stable across loads
  // (unlike the block clientId, which wp-graphql regenerates per request) and
  // distinct per block, so two portfolio blocks on one page don't share state.
  function hashString(str: string): string {
    let h = 0
    for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0
    return (h >>> 0).toString(36)
  }
  let stateKey = $state('')
  let restored = $state(false)

  onMount(() => {
    let ident = 'default'
    try {
      ident = hashString(JSON.stringify(config ?? {}))
    } catch {
      ident = String(displayMode ?? 'x')
    }
    stateKey = `nhtbl:portfolio:${window.location.pathname}:${ident}`
    try {
      const saved = sessionStorage.getItem(stateKey)
      if (saved) {
        const s = JSON.parse(saved)
        if (s.viewMode) viewMode = s.viewMode
        if (typeof s.searchTerm === 'string') searchTerm = s.searchTerm
        selectedServices = Array.isArray(s.selectedServices) ? s.selectedServices : []
        sortKey = s.sortKey ?? null
        if (s.sortDir) sortDir = s.sortDir
      }
    } catch {
      // ignore malformed / unavailable storage
    }
    restored = true
  })

  $effect(() => {
    // Only persist after the initial restore so we don't overwrite saved state
    // with the component's defaults on first mount.
    if (!restored || !stateKey || typeof window === 'undefined') return
    const snapshot = { viewMode, searchTerm, selectedServices, sortKey, sortDir }
    try {
      sessionStorage.setItem(stateKey, JSON.stringify(snapshot))
    } catch {
      // ignore quota / unavailable storage
    }
  })
</script>

<!-- View-mode icons (one per mode), rendered in the Mode picker. -->
{#snippet modeIcon(key: string)}
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
    {#if key === 'list'}
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    {:else if key === 'masonry'}
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7zM4 13h7v7H4z" />
    {:else if key === 'horizontal_scroll'}
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 5h10v14H7zM3 8v8M21 8v8" />
    {:else if key === 'images'}
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" />
      <circle cx="8.5" cy="9" r="1.5" stroke="currentColor" stroke-width="2" />
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.5-4 3.5 3 4-4 4 4" />
    {/if}
  </svg>
{/snippet}

<div class="portfolio-root" style={themeVars}>
{#if enableSearch}
  <!-- Portfolio Controls (only show when search is enabled) -->
  <div class="portfolio-controls {alignmentClass} mb-8 sticky top-24 w-full z-10">
    <!-- View Mode Toggle Buttons -->
    <div class="flex items-center gap-4 justify-between mb-6">
      <!-- Search Box -->
      <div class="relative w-full">
        <div class="absolute inset-y-0 z-10 left-0 pl-3 flex items-center pointer-events-none">
          <!-- Search Icon SVG -->
          <svg class="h-5 w-5 text-[var(--pf-bg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          bind:value={searchTerm}
          placeholder="Search projects by title, client, service, or description..."
          class="w-full pl-10 pr-12 py-3  bg-[var(--pf-input)] rounded-full backdrop-blur-md border-none focus:outline-none transition-colors text-[var(--pf-bg)] font-medium placeholder:text-[var(--pf-bg-muted)]"
        />
        {#if searchTerm}
          <div class="absolute inset-y-0 right-0 flex flex-row items-center">
            <p class="text-[var(--pf-bg-muted)] pr-3 text-sm">
              {#if viewMode === 'images' && debouncedSearchTerm}
                {displayedImages.length} image{displayedImages.length !== 1 ? 's' : ''} found
              {:else if viewMode !== 'images'}
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              {/if}
            </p>
            <button onclick={() => { searchTerm = ''; debouncedSearchTerm = '' }} class="pr-3 flex items-center text-[var(--pf-bg-muted)] hover:text-[var(--pf-bg)] transition-colors" aria-label="Clear search">
              <!-- X Icon SVG -->
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        {/if}
      </div>

      <!-- Service filter: a popup of every service across the listed projects.
           Multi-select (AND) — a project must offer all selected services. -->
      {#if allServices.length > 0}
        <div class="relative flex flex-shrink-0 items-center gap-2 text-sm">
          <button
            class="flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--pf-border)] px-3 py-1.5 text-[var(--pf-fg)] transition-colors hover:border-[var(--pf-fg)]"
            onclick={() => (showServiceMenu = !showServiceMenu)}
          >
            Filter by service{selectedServices.length ? ` (${selectedServices.length})` : ''}
          </button>
          {#if selectedServices.length}
            <button
              class=""
              onclick={() => (selectedServices = [])}
              aria-label="Clear service filters"
            >
              ✕
            </button>
          {/if}

          {#if showServiceMenu}
            <!-- click-outside backdrop -->
            <button
              class="fixed inset-0 z-10 cursor-default"
              onclick={() => (showServiceMenu = false)}
              aria-label="Close service menu"
              tabindex="-1"
            ></button>
            <!-- 400px panel of service tags, styled like the portfolio-card chips.
                 Each toggles its selection (multi-select, AND). -->
            <div
              class="absolute right-0 top-full z-20 mt-1 w-[400px] max-w-[90vw] rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg)] p-3 shadow-lg"
            >
              <div class="flex flex-row flex-wrap gap-2">
                {#each allServices as svc}
                  {@const active = selectedServices.includes(svc)}
                  <button
                    class="font-sans text-xs rounded-full border px-2 py-0.5 whitespace-nowrap transition-colors {active
                      ? 'bg-[var(--pf-fg)] text-[var(--pf-bg)] border-[var(--pf-fg)]'
                      : 'border-[var(--pf-fg)] text-[var(--pf-fg)] hover:bg-[var(--pf-fg)] hover:text-[var(--pf-bg)]'}"
                    onclick={() => toggleService(svc)}
                  >
                    {svc}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Mode picker: one button showing the current mode (icon + label) that
           opens a popup to choose another — same UX as the service filter. -->
      <div class="relative flex flex-shrink-0 items-center">
        <button
          class="flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--pf-border)] px-3 py-1.5 text-[var(--pf-fg)] transition-colors hover:border-[var(--pf-fg)]"
          onclick={() => (showModeMenu = !showModeMenu)}
          aria-label="Choose view mode"
        >
          {@render modeIcon(viewMode)}
          <span>{currentModeLabel}</span>
          <span class="text-[0.65rem]">▾</span>
        </button>

        {#if showModeMenu}
          <button
            class="fixed inset-0 z-10 cursor-default"
            onclick={() => (showModeMenu = false)}
            aria-label="Close mode menu"
            tabindex="-1"
          ></button>
          <div
            class="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg)] p-1 shadow-lg"
          >
            {#each VIEW_MODES as m}
              <button
                class="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left transition-colors {viewMode === m.key
                  ? 'bg-[var(--pf-fg)] text-[var(--pf-bg)]'
                  : 'text-[var(--pf-fg)] hover:bg-[var(--pf-fg)] hover:text-[var(--pf-bg)]'}"
                onclick={() => {
                  viewMode = m.key
                  showModeMenu = false
                }}
              >
                {@render modeIcon(m.key)}
                <span>{m.label}</span>
              </button>
            {/each}
          </div>
        {/if}
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
        <div class="flex-shrink-0 w-[85%] lg:w-5/12">
          <FeaturedProject displayMode="block" {project} {enableSearch} {showTags} {selectedServices} onServiceClick={handleServiceClick} />
        </div>
      {/each}
    </div>
  </div>
{:else if viewMode === 'masonry'}
  <!-- Masonry Layout -->
  <div class="portfolio-masonry my-16 full-width-breakout">
    {#if filteredProjects.length > 0}
      <Masonry items={filteredProjects} {minColWidth} {maxColWidth} {gap} idKey="slug" let:item animate>
        <FeaturedProject displayMode="masonryBlock" project={item} {enableSearch} {showTags} {selectedServices} onServiceClick={handleServiceClick} />
      </Masonry>
    {:else}
      <div class="text-center py-12 {alignmentClass}">
        <p class="">No projects found.</p>
      </div>
    {/if}
  </div>
{:else if viewMode === 'list'}
  <!-- List Layout -->
  <div class="portfolio-list {alignmentClass} my-8">
    <!-- Sortable column headers (aligned to FeaturedProject's grid template) -->
    <div class="grid grid-cols-[4rem_1fr_1.5fr_2.5fr_1.5fr] items-center gap-4 px-3 py-2 mb-2 border-b border-[var(--pf-border)] text-xs uppercase tracking-wide">
      {#each [{ key: 'year', label: 'Year' }, { key: 'client', label: 'Client' }] as col}
        <button
          class="flex items-center gap-1 text-left transition-colors {sortKey === col.key ? 'text-[var(--pf-fg)]' : 'text-[var(--pf)] hover:text-[var(--pf-fg)]'}"
          onclick={() => toggleSort(col.key as SortKey)}
        >
          {col.label}
          <span class="text-[0.65rem]">{sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
        </button>
      {/each}
      <span class="text-[var(--pf-muted)]">Title</span>
      <span class="text-[var(--pf-muted)]">Description</span>
      <span class="text-[var(--pf-muted)]">Services</span>
    </div>

    <div class="space-y-5">
      {#each sortedProjects as project (project.slug)}
        <FeaturedProject displayMode="grid" {project} {enableSearch} {showTags} {selectedServices} onServiceClick={handleServiceClick} />
      {/each}
    </div>

    {#if sortedProjects.length === 0}
      <div class="text-center py-12">
        <p class="text-[var(--pf-muted)]">No projects found.</p>
      </div>
    {/if}
  </div>
{:else if viewMode === 'images'}
  <!-- Image Gallery Layout -->
  <div class="portfolio-images my-16 full-width-breakout">
    {#if isLoadingImages}
      <div class="text-center py-12 {alignmentClass}">
        <p class="text-[var(--pf-muted)]">Loading images...</p>
      </div>
    {:else if displayedImages.length > 0}
      <Masonry items={displayedImages} {minColWidth} {maxColWidth} {gap} idKey="id" animate let:item={image}>
        <div 
          class="cursor-pointer hover:opacity-80 transition-opacity group"
          onclick={() => handleImageClick(image)}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === 'Enter' && handleImageClick(image)}
        >
          <div class="relative overflow-hidden rounded-lg">
            <Image 
              imageObject={image} 
              imageSize="medium" 
              fit="cover" 
              aspect="auto"
              lazy={true}
            />
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-[var(--pf-muted)] mt-1">
            From: <a href={image.projectUri} class="underline hover:text-[var(--pf-fg)]" onclick={(e) => e.stopPropagation()}>{image.projectTitle}</a>
          </p>
        </div>
      </Masonry>
    {:else}
      <div class="text-center py-12 {alignmentClass}">
        <p class="text-[var(--pf-muted)]">No images found.</p>
      </div>
    {/if}
  </div>
{/if}
</div>

<!-- Image Modal -->
<ImageModal
  image={selectedImage} 
  isOpen={isModalOpen} 
  onclose={handleModalClose}
/>

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
