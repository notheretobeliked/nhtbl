<script lang="ts">
  import { onMount, tick, untrack } from 'svelte'
  import { page } from '$app/stores'
  import { replaceState } from '$app/navigation'
  import {
    readPortfolioUrlState,
    writePortfolioUrlState,
    type PortfolioView
  } from '$lib/utilities/portfolioUrlState'
  import FeaturedProject from '$components/molecules/FeaturedProject.svelte'
  import Image from '$components/atoms/Image.svelte'
  import ImageModal from '$components/molecules/ImageModal.svelte'
  import Masonry from 'svelte-bricks'
  import type { AcfPortfolioBlock, ProjectsQuery, ProjectImagesQuery } from '$lib/graphql/generated'
  import { getDisplayMode } from '$lib/utilities/portfolioResolver'
  import { filterImagesByProject, randomizeImages, type ProcessedImage } from '$lib/utilities/imageExtractor'
  import { staggerReveal } from '$lib/actions/stagger-reveal'

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
  // When the block itself has no colour set, fall back to the page's configured
  // background (and a contrasting text colour) so the controls match the page
  // instead of the dark-section defaults.
  const pageBgSlug = $derived.by(() => {
    const raw = ($page.data as any)?.backgroundColour
    return (Array.isArray(raw) ? raw[0] : raw) ?? 'white'
  })
  const pageBgHex = $derived(PALETTE[pageBgSlug] ?? '#FFFFFF')
  const pageFgHex = $derived(pageBgSlug === 'black' ? '#FFFFFF' : '#000000')

  const themeVars = $derived.by(() => {
    const style = parseStyle((block.attributes as any)?.style)
    const fg = resolveColor((block.attributes as any)?.textColor, style?.color?.text, pageFgHex)
    const bg = resolveColor((block.attributes as any)?.backgroundColor, style?.color?.background, pageBgHex)
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
  // The search field is tucked behind an icon button; see the controls markup.
  let searchOpen = $state(false)
  let searchInput = $state<HTMLInputElement>()
  const searchVisible = $derived(searchOpen || searchTerm.length > 0)
  const openSearch = async () => {
    searchOpen = true
    await tick()
    searchInput?.focus()
  }
  const closeSearch = () => {
    searchTerm = ''
    debouncedSearchTerm = ''
    searchOpen = false
  }
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

  // Step through the images currently shown in the gallery, wrapping at the ends.
  const stepImage = (delta: number) => {
    const list = displayedImages
    if (!selectedImage || list.length < 2) return
    const current = list.findIndex((img) => img.id === selectedImage?.id)
    selectedImage = list[(Math.max(current, 0) + delta + list.length) % list.length]
  }
  const selectedPosition = $derived(
    selectedImage ? displayedImages.findIndex((img) => img.id === selectedImage?.id) + 1 : 0
  )

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

  // Type filter (Workshop, Talk or teaching, Exhibition…). Unlike services this
  // is OR: picking two types shows entries of either kind.
  const typeNamesOf = (p: any): string[] =>
    (p?.nhtblTypes?.nodes ?? []).map((t: any) => t?.name).filter(Boolean)
  const toggleType = (type: string) => applyTagFilter(slugsFromNames([type], 'nhtblTypes'))
  const allTypes = $derived.by(() => {
    const set = new Set<string>()
    for (const p of projects as any[]) for (const t of typeNamesOf(p)) set.add(t)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })

  // The filter popup works with tag names; shared URLs use slugs.
  type TagField = 'nhtblTypes' | 'nhtblServices'
  const tagPairs = (field: TagField): Array<{ name: string; slug: string }> => {
    const seen = new Map<string, string>()
    for (const p of projects as any[]) {
      for (const node of p?.[field]?.nodes ?? []) {
        if (node?.slug && node?.name) seen.set(node.slug, node.name)
      }
    }
    return [...seen].map(([slug, name]) => ({ slug, name }))
  }
  const namesFromSlugs = (slugs: string[], field: TagField): string[] => {
    const pairs = tagPairs(field)
    return slugs.map((slug) => pairs.find((p) => p.slug === slug)?.name).filter(Boolean) as string[]
  }
  const slugsFromNames = (names: string[], field: TagField): string[] => {
    const pairs = tagPairs(field)
    return names.map((name) => pairs.find((p) => p.name === name)?.slug).filter(Boolean) as string[]
  }
  const VIEW_TO_URL: Record<string, PortfolioView | undefined> = {
    masonry: 'grid',
    list: 'list',
    images: 'gallery'
  }
  const VIEW_FROM_URL: Record<PortfolioView, 'masonry' | 'list' | 'images'> = {
    grid: 'masonry',
    list: 'list',
    gallery: 'images'
  }

  // Statement filter: links in the page's own text with an href like
  // "#filter=website" (or several slugs, "#filter=posters,printed-matter") act
  // as filters on this list. One term is active at a time; clicking it again
  // clears it. A project matches if any of its service or type slugs is listed.
  let statementFilter = $state<string[]>([])
  let rootEl = $state<HTMLDivElement>()
  const slugsOf = (p: any): string[] =>
    [...(p?.nhtblServices?.nodes ?? []), ...(p?.nhtblTypes?.nodes ?? [])]
      .map((n: any) => n?.slug)
      .filter(Boolean)
  const parseFilterHref = (href: string | null): string[] | null => {
    const match = href?.match(/#filter=([^&#]+)/)
    if (!match) return null
    return decodeURIComponent(match[1])
      .split(',')
      .map((slug) => slug.trim().toLowerCase())
      .filter(Boolean)
  }
  const sameSlugs = (a: string[], b: string[]) =>
    a.length === b.length && a.every((slug) => b.includes(slug))

  // Talks, workshops and the like mostly have no images, so a term that matches
  // more list-only entries than full projects opens as the list; anything else
  // uses the block's configured view.
  const viewForStatement = (slugs: string[]) => {
    const matches = (projects as any[]).filter((p) => slugsOf(p).some((s) => slugs.includes(s)))
    const listOnly = matches.filter((p) => p?.hasContent === false).length
    return listOnly > matches.length - listOnly ? 'list' : displayMode
  }

  const applyStatementFilter = (slugs: string[]) => {
    if (sameSlugs(slugs, statementFilter)) {
      statementFilter = []
      viewMode = displayMode
    } else {
      statementFilter = slugs
      viewMode = viewForStatement(slugs)
    }
    // Bring the results into view if they're mostly below the fold.
    const top = rootEl?.getBoundingClientRect().top ?? 0
    if (top > window.innerHeight * 0.6) {
      rootEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // A tag picked from the Filter menu or clicked on a row. Same single filter
  // as the statement, but it leaves the view alone unless the grid would have
  // little to show for it.
  const applyTagFilter = (slugs: string[]) => {
    if (!slugs.length) return
    if (sameSlugs(slugs, statementFilter)) {
      statementFilter = []
      return
    }
    statementFilter = slugs
    if (viewMode === 'masonry' && viewForStatement(slugs) === 'list') viewMode = 'list'
  }

  // One filter at a time. These are the tag names it covers, for marking the
  // matching tags in the menu and on the rows as active.
  const selectedServices = $derived(namesFromSlugs(statementFilter, 'nhtblServices'))
  const selectedTypes = $derived(namesFromSlugs(statementFilter, 'nhtblTypes'))
  const hasFilter = $derived(statementFilter.length > 0)

  const toggleService = (svc: string) => applyTagFilter(slugsFromNames([svc], 'nhtblServices'))

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

    // The one active filter: a statement term, or a tag from the menu or a row.
    if (statementFilter.length > 0) {
      result = result.filter((project: any) =>
        slugsOf(project).some((slug) => statementFilter.includes(slug))
      )
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
        const typeMatch = typeNamesOf(project).some((t) => t.toLowerCase().includes(searchLower))
        return titleMatch || excerptMatch || clientMatch || serviceMatch || typeMatch
      })
    }

    return result
  })

  // List-only entries (no content, so no page or image) belong in the list view
  // only; the carousel and grid show full projects.
  const visualProjects = $derived(filteredProjects.filter((p: any) => p?.hasContent !== false))

  // The grid's masonry keeps every item in the column it was first given (so
  // nothing jumps while images load). That also means that after a filter the
  // survivors stay put, leaving holes. Rebuilding the grid whenever the set of
  // projects changes lays the remaining ones out afresh.
  const gridKey = $derived(visualProjects.map((p: any) => p?.slug).join('|'))
  // The full grid keeps the stable layout, so tiles don't swap columns as their
  // images load. A filtered grid is small and its images are usually already
  // loaded, so it balances column heights instead of leaving one column long.
  const gridIsFiltered = $derived(
    visualProjects.length < (projects as any[]).filter((p) => p?.hasContent !== false).length
  )

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
        // Sort by end year so the most recently finished work comes first.
        // Ongoing projects (a start but no end) are treated as ending on Jan 1 of
        // the current year: they outrank older finished work but fall below
        // projects actually completed later this year.
        const { startDate, endDate } = project.projectData ?? {}
        if (startDate && !endDate) return new Date(new Date().getFullYear(), 0, 1).getTime()
        const d = endDate || startDate
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
        statementFilter = Array.isArray(s.statementFilter) ? s.statementFilter : []
        sortKey = s.sortKey ?? null
        if (s.sortDir) sortDir = s.sortDir
      }
    } catch {
      // ignore malformed / unavailable storage
    }

    // A shared link wins over whatever this browser remembered. Read from
    // window.location, not $page.url: the page is prerendered, where query
    // params aren't available.
    const fromUrl = enableSearch ? readPortfolioUrlState(window.location.search) : null
    if (fromUrl) {
      statementFilter = fromUrl.filter
      searchTerm = fromUrl.q
      debouncedSearchTerm = fromUrl.q
      viewMode = fromUrl.view
        ? VIEW_FROM_URL[fromUrl.view]
        : fromUrl.filter.length
          ? viewForStatement(fromUrl.filter)
          : displayMode
    }
    restored = true
  })

  // Keep the address bar in step with the filters so the current view can be
  // copied and shared. replaceState, so filtering doesn't pile up history entries.
  $effect(() => {
    if (!restored || !enableSearch || typeof window === 'undefined') return
    const search = writePortfolioUrlState(window.location.search, {
      filter: statementFilter,
      q: debouncedSearchTerm,
      view: viewMode !== displayMode ? (VIEW_TO_URL[viewMode] ?? null) : null
    })
    // Deferred a tick: on first load this can run before SvelteKit's router is ready.
    const timer = setTimeout(() => {
      if (search === window.location.search) return
      const url = `${window.location.pathname}${search}${window.location.hash}`
      try {
        replaceState(url, $page.state)
      } catch {
        history.replaceState(history.state, '', url)
      }
    }, 0)
    return () => clearTimeout(timer)
  })

  // Statement links live outside this component (in the page's text), so they're
  // handled with a document-level listener. Only the searchable block — the main
  // list — responds, so a page with several portfolio blocks has one owner.
  onMount(() => {
    if (!enableSearch) return
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href*="#filter="]')
      const slugs = parseFilterHref(link?.getAttribute('href') ?? null)
      if (!link || !slugs?.length) return
      event.preventDefault()
      applyStatementFilter(slugs)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  })

  // Mark the active statement link (styled in app.css).
  $effect(() => {
    const active = statementFilter
    if (!restored || !enableSearch || typeof document === 'undefined') return
    for (const link of document.querySelectorAll('a[href*="#filter="]')) {
      const slugs = parseFilterHref(link.getAttribute('href')) ?? []
      const on = active.length > 0 && sameSlugs(slugs, active)
      link.classList.toggle('filter-active', on)
      link.setAttribute('role', 'button')
      link.setAttribute('aria-pressed', String(on))
    }
  })

  $effect(() => {
    // Only persist after the initial restore so we don't overwrite saved state
    // with the component's defaults on first mount.
    if (!restored || !stateKey || typeof window === 'undefined') return
    const snapshot = {
      viewMode,
      searchTerm,
      statementFilter,
      sortKey,
      sortDir
    }
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

<div class="portfolio-root scroll-mt-24" style={themeVars} bind:this={rootEl}>
{#if enableSearch}
  <!-- Portfolio Controls (only show when search is enabled) -->
  <div class="portfolio-controls {alignmentClass} mb-8 sticky top-24 w-full z-10">
    <!-- View Mode Toggle Buttons -->
    <div class="flex items-center gap-3 justify-end mb-6">
      <!-- Search: an icon button that widens into the field when clicked (animated
           via flex-grow), keeping the same grey pill look as the other controls.
           It stays open while it holds text, and closes when emptied — on blur,
           with Escape, or with its ✕. The input is always in the DOM so the
           width can animate; it's inert while collapsed. -->
      <div
        class="search-pill relative h-10 min-w-0 overflow-hidden rounded-full border bg-[var(--pf-bg)] text-[var(--pf-fg)] transition-[flex-grow,border-color] duration-300 ease-out {searchVisible
          ? 'border-[var(--pf-fg)]'
          : 'border-[var(--pf-border)] hover:border-[var(--pf-fg)]'}"
        style:flex={searchVisible ? '1 1 2.5rem' : '0 0 2.5rem'}
      >
        <button
          class="absolute inset-y-0 left-0 flex w-10 items-center justify-center {searchVisible ? 'cursor-default' : 'cursor-pointer'}"
          onclick={openSearch}
          aria-label="Search projects"
          aria-expanded={searchVisible}
          tabindex={searchVisible ? -1 : 0}
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <input
          type="text"
          bind:this={searchInput}
          bind:value={searchTerm}
          placeholder="Search by title, organisation, service or description"
          aria-label="Search projects"
          tabindex={searchVisible ? 0 : -1}
          onblur={() => {
            if (!searchTerm.trim()) searchOpen = false
          }}
          onkeydown={(e) => {
            if (e.key === 'Escape') closeSearch()
          }}
          class="absolute inset-y-0 left-10 right-10 w-[calc(100%-5rem)] min-w-0 border-none bg-transparent p-0 text-base text-[var(--pf-fg)] placeholder:text-[var(--pf-muted)] focus:outline-none transition-opacity duration-200 {searchVisible
            ? 'opacity-100 delay-100'
            : 'pointer-events-none opacity-0'}"
        />
        <div
          class="absolute inset-y-0 right-0 flex flex-row items-center bg-[var(--pf-bg)] transition-opacity duration-200 {searchVisible
            ? 'opacity-100'
            : 'pointer-events-none opacity-0'}"
        >
          {#if searchTerm}
            <p class="m-0 pl-2 pr-2 text-sm whitespace-nowrap text-[var(--pf-muted)]">
              {#if viewMode === 'images' && debouncedSearchTerm}
                {displayedImages.length} image{displayedImages.length !== 1 ? 's' : ''} found
              {:else if viewMode !== 'images'}
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              {/if}
            </p>
          {/if}
          <!-- mousedown, not click: it must run before the input's blur closes the field. -->
          <button
            onmousedown={(e) => {
              e.preventDefault()
              closeSearch()
            }}
            class="flex h-10 w-10 items-center justify-center text-[var(--pf-fg)]"
            aria-label="Clear and close search"
            tabindex={searchVisible ? 0 : -1}
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Service filter: a popup of every service across the listed projects.
           Multi-select (AND) — a project must offer all selected services. -->
      {#if allServices.length > 0 || allTypes.length > 0}
        <div class="relative flex flex-shrink-0 items-center gap-2">
          <button
            class="flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-[var(--pf-border)] bg-[var(--pf-bg)] px-4 text-base text-[var(--pf-fg)] transition-colors hover:border-[var(--pf-fg)]"
            onclick={() => (showServiceMenu = !showServiceMenu)}
          >
            Filter
          </button>
          {#if hasFilter}
            <button
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[var(--pf-border)] bg-[var(--pf-bg)] text-[var(--pf-fg)] transition-colors hover:border-[var(--pf-fg)]"
              onclick={() => (statementFilter = [])}
              aria-label="Clear filter"
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
              {#if allTypes.length > 0}
                <p class="m-0 mb-2 text-xs uppercase tracking-wide text-[var(--pf-fg)]">Type</p>
                <div class="mb-4 flex flex-row flex-wrap gap-2">
                  {#each allTypes as type}
                    {@const active = selectedTypes.includes(type)}
                    <button
                      class="font-sans text-xs rounded-full border px-2 py-0.5 whitespace-nowrap transition-colors {active
                        ? 'bg-[var(--pf-fg)] text-[var(--pf-bg)] border-[var(--pf-fg)]'
                        : 'border-[var(--pf-fg)] text-[var(--pf-fg)] hover:bg-[var(--pf-fg)] hover:text-[var(--pf-bg)]'}"
                      onclick={() => {
                        toggleType(type)
                        showServiceMenu = false
                      }}
                    >
                      {type}
                    </button>
                  {/each}
                </div>
                <p class="m-0 mb-2 text-xs uppercase tracking-wide text-[var(--pf-fg)]">Service</p>
              {/if}
              <div class="flex flex-row flex-wrap gap-2">
                {#each allServices as svc}
                  {@const active = selectedServices.includes(svc)}
                  <button
                    class="font-sans text-xs rounded-full border px-2 py-0.5 whitespace-nowrap transition-colors {active
                      ? 'bg-[var(--pf-fg)] text-[var(--pf-bg)] border-[var(--pf-fg)]'
                      : 'border-[var(--pf-fg)] text-[var(--pf-fg)] hover:bg-[var(--pf-fg)] hover:text-[var(--pf-bg)]'}"
                    onclick={() => {
                      toggleService(svc)
                      showServiceMenu = false
                    }}
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
          class="flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-[var(--pf-border)] bg-[var(--pf-bg)] px-4 text-base text-[var(--pf-fg)] transition-colors hover:border-[var(--pf-fg)]"
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
      {#each visualProjects as project (project.slug)}
        <div class="flex-shrink-0 w-[85%] lg:w-5/12" use:staggerReveal>
          <FeaturedProject displayMode="block" {project} {enableSearch} {showTags} {selectedServices} onServiceClick={handleServiceClick} />
        </div>
      {/each}
    </div>
  </div>
{:else if viewMode === 'masonry'}
  <!-- Masonry Layout -->
  <div class="portfolio-masonry my-16 full-width-breakout">
    {#if visualProjects.length > 0}
      {#key gridKey}
        <Masonry items={visualProjects} {minColWidth} {maxColWidth} {gap} idKey="slug" order={gridIsFiltered ? 'balanced' : 'balanced-stable'} animate>
          {#snippet children({ item }: { item: any })}
            <div use:staggerReveal>
              <FeaturedProject displayMode="masonryBlock" project={item} {enableSearch} {showTags} {selectedServices} onServiceClick={handleServiceClick} />
            </div>
          {/snippet}
        </Masonry>
      {/key}
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
      {#each [{ key: 'year', label: 'Year' }, { key: 'client', label: 'With' }] as col}
        <button
          class="flex items-center gap-1 text-left"
          onclick={() => toggleSort(col.key as SortKey)}
        >
          {col.label}
          <span class="text-[0.65rem]">{sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
        </button>
      {/each}
      <span>Title</span>
      <span>Description</span>
      <span>Services</span>
    </div>

    <div class="space-y-5">
      {#each sortedProjects as project (project.slug)}
        <div use:staggerReveal>
          <FeaturedProject displayMode="grid" {project} {enableSearch} {showTags} {selectedServices} onServiceClick={handleServiceClick} />
        </div>
      {/each}
    </div>

    {#if sortedProjects.length === 0}
      <div class="text-center py-12">
        <p>No projects found.</p>
      </div>
    {/if}
  </div>
{:else if viewMode === 'images'}
  <!-- Image Gallery Layout -->
  <div class="portfolio-images my-16 full-width-breakout !px-0">
    {#if isLoadingImages}
      <div class="text-center py-12 {alignmentClass}">
        <p>Loading images...</p>
      </div>
    {:else if displayedImages.length > 0}
      <!-- order="row-first" (round-robin): the gallery can hold hundreds of images,
           and svelte-bricks' default balanced-stable re-runs an O(n) redistribution on
           every ResizeObserver measurement (O(n²) → main-thread freeze). row-first
           distributes without reading measured heights, so it scales. -->
      <Masonry items={displayedImages} {minColWidth} {maxColWidth} gap={0} idKey="id" order="row-first">
        {#snippet children({ item: image }: { item: ProcessedImage })}
        <!-- No per-item reveal here: the gallery can hold hundreds of images, and
             making each one opacity:0 + will-change + an observer entry overwhelms
             the compositor. The grid/list (dozens of items) keep the stagger.

             Clicking a tile opens the image large. Hovering shows a small green
             pill in the middle saying which project it's from; the pill is the
             link to that project (a sibling of the button, not inside it). -->
        <div class="gallery-tile group relative">
          <button
            class="block w-full cursor-zoom-in"
            onclick={() => handleImageClick(image)}
            aria-label="View image larger, from {image.projectTitle}"
          >
            <Image imageObject={image as any} imageSize="medium" fit="cover" lazy={true} />
          </button>
          <a
            href={image.projectUri}
            class="absolute left-1/2 top-1/2 z-10 max-w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[1.1rem] bg-nhtbl-green-base px-3 py-1 text-center font-sans text-sm text-black opacity-0 transition-opacity duration-150 hover:brightness-95 group-hover:opacity-100 focus-visible:opacity-100"
          >
            From {image.projectTitle}
          </a>
        </div>
        {/snippet}
      </Masonry>
    {:else}
      <div class="text-center py-12 {alignmentClass}">
        <p>No images found.</p>
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
  onprev={displayedImages.length > 1 ? () => stepImage(-1) : undefined}
  onnext={displayedImages.length > 1 ? () => stepImage(1) : undefined}
  position={selectedPosition}
  total={displayedImages.length}
/>

<style>
  /* Tailwind 4: scoped component styles need a reference to the theme to use @apply. */
  @reference "../../app.css";

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
