<script lang="ts">
  import type { MediaItem, ProjectsQuery } from '$lib/graphql/generated'
  import Image from '$components/atoms/Image.svelte'
  import CoreHeading from '$components/blocks/CoreHeading.svelte'

  // A resolved portfolio project node (see projects.graphql / portfolioResolver).
  type ProjectData = NonNullable<NonNullable<ProjectsQuery['nhtblProjects']>['nodes']>[number]

  interface Props {
    project: ProjectData
    displayMode?: 'block' | 'grid' | 'masonryBlock'
    enableSearch?: boolean
    showTags?: boolean
    selectedServices?: string[]
    onServiceClick?: (serviceName: string) => void
  }

  let {
    project,
    displayMode = 'block',
    enableSearch = false,
    showTags = true,
    selectedServices = [],
    onServiceClick
  }: Props = $props()

  let isHover: boolean = $state(false)

  // Transform the featured image to match MediaItem interface
  const imageObject: MediaItem = $derived({
    altText: project.featuredImage?.node?.altText ?? '',
    colorPalette: project.featuredImage?.node?.colorPalette ?? null,
    dominantColor: project.featuredImage?.node?.dominantColor ?? null,
    secondaryColor: project.featuredImage?.node?.secondaryColor ?? null,
    mediaDetails: {
      sizes:
        project.featuredImage?.node?.mediaDetails?.sizes?.map(size => ({
          name: size?.name ?? '',
          sourceUrl: size?.sourceUrl ?? '',
          width: size?.width ?? '',
          height: size?.height ?? '',
        })) ?? [],
    },
    contentTypeName: 'attachment',
    databaseId: 0,
    id: project.slug ?? '',
    mediaItemId: 0,
    isComment: false,
    isTermNode: false,
    isContentNode: true,
    isFrontPage: false,
    isPostsPage: false,
    slug: project.slug ?? '',
    uri: project.slug ?? '',
  })

  // Format year display
  const formatYearRange = (startDate: string | null | undefined, endDate: string | null | undefined) => {
    // If both dates are empty, return empty string
    if (!startDate && !endDate) {
      return ''
    }

    // If start date is empty but end date exists, return just end year
    if (!startDate && endDate) {
      const endYear = new Date(endDate).getFullYear()
      return `(${endYear})`
    }

    // If end date is empty but start date exists, return just start year
    if (startDate && !endDate) {
      const startYear = new Date(startDate).getFullYear()
      return `(${startYear} –)`
    }

    // Both dates exist
    if (startDate && endDate) {
      const startYear = new Date(startDate).getFullYear()
      const endYear = new Date(endDate).getFullYear()

      if (startYear === endYear) {
        return `(${startYear})`
      } else {
        // Use last two digits of end year if different
        const endYearShort = endYear.toString().slice(-2)
        return `(${startYear}–${endYearShort})`
      }
    }

    return ''
  }

  const yearDisplay = $derived(
    formatYearRange(project.projectData?.startDate, project.projectData?.endDate)
  )
  // Plain year (no parentheses) for the columnar grid/list row.
  const yearPlain = $derived(yearDisplay.replace(/[()]/g, '').trim())

  // Create heading block object for CoreHeading
  const headingBlock = $derived({
    attributes: {
      content: project.title,
      fontSize: 'lg',
      textAlign: 'left',
      level: 3,
    },
    isDynamic: false,
    name: 'core/heading',
    type: 'core/heading',
  })

  // Get client names concatenated
  const clientNames = $derived(
    project.nhtblClients?.nodes
      ?.map(client => client?.name)
      .filter(Boolean)
      .join(', ') ?? ''
  )

  // Get service names - only second level (children with parentId)
  const serviceNames = $derived(
    project.nhtblServices?.nodes
      ?.filter(service => service?.parentId !== null && service?.parentId !== undefined)
      ?.map(service => service?.name)
      ?.filter(Boolean) ?? []
  )
</script>

{#if displayMode === 'masonryBlock'}
  <!-- Masonry Block Mode - mirrors PortfolioItem -->
  <article class="featured-project">
    <a href={project.uri}>
      <div 
        class="cursor-pointer relative" 
        role="button"
        tabindex="0"
        onmouseenter={() => (isHover = true)} 
        onmouseleave={() => (isHover = false)}
      >
        <Image {imageObject} imageSize="medium" fit="contain" />
        {#if isHover}
          <div class="bg-nhtbl-green-base p-3 bg-opacity-90 absolute inset-0 flex flex-col justify-center content-center items-center z-10">
            <p class="text-black text-base lg:text-lg font-display text-center w-full">{project.title}</p>
            {#if clientNames}
              <p class="text-black text-sm mt-2 font-sans text-center w-full">
                {clientNames} {yearDisplay ? ` ${yearDisplay}` :  ''}
              </p>
            {/if}
            {#if yearDisplay}
              <p class="text-black text-small md:text-base mt-1 font-display text-center w-full">
                
              </p>
            {/if}
            {#if showTags && serviceNames.length > 0}
              <div class="services flex flex-row gap-1 mt-2 flex-wrap justify-center">
                {#each serviceNames as serviceName}
                  {#if onServiceClick}
                    <button 
                      class="font-sans text-xs rounded-full border border-black px-2 py-0 whitespace-nowrap transition-colors cursor-pointer {selectedServices.includes(serviceName ?? '')
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-black hover:text-white'}"
                      onclick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onServiceClick?.(serviceName ?? '')
                      }}
                    >
                      {serviceName}
                    </button>
                  {:else}
                    <div class="font-sans text-xs rounded-full border border-black px-2 py-0 whitespace-nowrap text-black">{serviceName}</div>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </a>
  </article>
{:else if displayMode === 'grid'}
  <!-- Grid Mode: a columnar list row — year · client · title · description · services -->
  <article class="featured-project group hover:bg-[var(--pf-fg)] transition-all rounded-lg hover:!text-[var(--pf-bg)]">
    <a class="grid grid-cols-[4rem_1fr_1.5fr_2.5fr_1.5fr] items-start gap-4 px-3 py-2 text-sm" href={project.uri}>
      <!-- Year -->
      <span class="font-display whitespace-nowrap">{yearPlain}</span>

      <!-- Client -->
      <span>{clientNames}</span>

      <!-- Title -->
      <span class="font-display">{project.title}</span>

      <!-- Description -->
      <div class="group-hover:text-[var(--pf-bg)] line-clamp-3 [&_p]:m-0">
        {@html project.excerpt ?? ''}
      </div>

      <!-- Services -->
      {#if showTags && serviceNames.length > 0}
        <div class="services flex flex-row gap-1 flex-wrap">
          {#each serviceNames as serviceName}
            {#if onServiceClick}
              <button
                class="group-hover:border-[var(--pf-bg)] font-sans text-xs rounded-full border border-[var(--pf-fg)] px-2 py-0 whitespace-nowrap transition-colors cursor-pointer {selectedServices.includes(serviceName ?? '')
                  ? 'bg-[var(--pf-fg)] text-[var(--pf-bg)]'
                  : 'hover:bg-black/20'}"
                onclick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onServiceClick?.(serviceName ?? '')
                }}
              >
                {serviceName}
              </button>
            {:else}
              <div class="group-hover:border-[var(--pf-bg)] font-sans text-xs rounded-full border border-[var(--pf-fg)] px-2 py-0 whitespace-nowrap">{serviceName}</div>
            {/if}
          {/each}
        </div>
      {:else}
        <span></span>
      {/if}
    </a>
  </article>
{:else}
  <!-- Block Mode -->
  <article class="featured-project p-2 group hover:bg-[var(--pf-fg)] transition-all rounded-lg hover:!text-[var(--pf-bg)]">
    <a class={displayMode === 'block' ? 'contents' : 'grid grid-cols-[1fr_4fr] gap-4'} href={project.uri}>
      <!-- Image -->
      <div class="mb-4 aspect-[4/3] {displayMode === 'block' ? 'w-full' : 'w-20 lg:w-56'}">
        <Image {imageObject} imageSize={displayMode === 'block' ? 'large' : 'small'} fit="cover" extraClasses="w-full" />
      </div>
      <div class={displayMode === 'block' ? 'contents' : 'flex flex-col'}>
        <!-- Heading (level 3) -->
          <CoreHeading block={headingBlock} />

        <!-- Content -->
        <div class="mb-4 max-w-md">
          {@html project.excerpt ?? ''}
        </div>

        <!-- Clients -->
        {#if clientNames}
          <p class="text-sm">
            With/for: {clientNames} {yearDisplay ? ` ${yearDisplay}` :  ''}
          </p>
        {/if}

        <!-- Services -->
        {#if showTags && serviceNames.length > 0}
          <div class="services flex flex-row gap-2 mt-4 flex-wrap">
            {#each serviceNames as serviceName}
              {#if onServiceClick}
                <button 
                  class="group-hover:border-[var(--pf-bg)] font-sans text-sm rounded-full border border-[var(--pf-fg)] px-2 py-0 whitespace-nowrap transition-colors cursor-pointer {selectedServices.includes(serviceName ?? '')
                    ? 'bg-[var(--pf-fg)] text-[var(--pf-bg)]'
                    : 'hover:bg-black/20'}"
                  onclick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onServiceClick?.(serviceName ?? '')
                  }}
                >
                  {serviceName}
                </button>
              {:else}
                <div class="group-hover:border-[var(--pf-bg)] font-sans text-sm rounded-full border border-[var(--pf-fg)] px-2 py-0 whitespace-nowrap">{serviceName}</div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    </a>
  </article>
{/if}
