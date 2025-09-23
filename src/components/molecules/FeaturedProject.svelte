<script lang="ts">
  import type { MediaItem } from '$lib/graphql/generated'
  import type { PortfolioBlockDetailsFragmentFragment, AcfPortfolioBlockFragmentFragment } from '$lib/graphql/generated'
  import Image from '$components/atoms/Image.svelte'
  import CoreHeading from '$components/blocks/CoreHeading.svelte'

  // Extract project types from both fragments and merge them
  type DetailsProjectNode = NonNullable<NonNullable<NonNullable<PortfolioBlockDetailsFragmentFragment['portfolioBlock']>['portfolioItems']>['nodes']>[number]

  type AcfProjectNode = NonNullable<NonNullable<NonNullable<AcfPortfolioBlockFragmentFragment['portfolioBlock']>['portfolioItems']>['nodes']>[number]

  // Merge the two project types to get all fields
  type ProjectData = Extract<DetailsProjectNode, { __typename?: 'Nhtbl_project' }> & Extract<AcfProjectNode, { __typename?: 'Nhtbl_project' }>

  interface Props {
    project: ProjectData
    displayMode?: 'block' | 'grid' | 'masonryBlock'
    enableSearch?: boolean
    onServiceClick?: (serviceName: string) => void
  }

  let { project, displayMode = 'block', enableSearch = false, onServiceClick }: Props = $props()

  let isHover: boolean = $state(false)

  // Transform the featured image to match MediaItem interface
  const imageObject: MediaItem = {
    altText: project.featuredImage?.node?.altText ?? '',
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
  }

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

  const yearDisplay = formatYearRange(project.projectData?.startDate, project.projectData?.endDate)
  

  // Create heading block object for CoreHeading
  const headingBlock = {
    attributes: {
      content: project.title,
      fontSize: 'lg',
      textAlign: 'left',
      level: 3,
    },
    isDynamic: false,
    name: 'core/heading',
    type: 'core/heading',
  }

  // Get client names concatenated
  const clientNames =
    project.nhtblClients?.nodes
      ?.map(client => client?.name)
      .filter(Boolean)
      .join(', ') ?? ''

  // Get service names - only second level (children with parentId)
  const serviceNames =
    project.nhtblServices?.nodes
      ?.filter(service => service?.parentId !== null && service?.parentId !== undefined)
      ?.map(service => service?.name)
      ?.filter(Boolean) ?? []
</script>

{#if displayMode === 'masonryBlock'}
  <!-- Masonry Block Mode - mirrors PortfolioItem -->
  <article class="featured-project">
    <a href={project.uri}>
      <div 
        class="cursor-pointer relative" 
        onmouseenter={() => (isHover = true)} 
        onmouseleave={() => (isHover = false)}
      >
        <Image {imageObject} imageSize="medium" fit="contain" />
        {#if isHover}
          <div class="bg-nhtbl-green-base p-3 bg-opacity-90 absolute inset-0 flex flex-col justify-center content-center items-center">
            <p class="text-black text-xl font-display text-center w-full">{project.title}</p>
            {#if clientNames}
              <p class="text-black text-small md:text-base mt-2 font-display text-center w-full">
                {clientNames}
              </p>
            {/if}
            {#if yearDisplay}
              <p class="text-black text-small md:text-base mt-1 font-display text-center w-full">
                {yearDisplay}
              </p>
            {/if}
            {#if serviceNames.length > 0}
              <div class="services flex flex-row gap-1 mt-2 flex-wrap justify-center">
                {#each serviceNames as serviceName}
                  {#if enableSearch && onServiceClick}
                    <button 
                      class="font-sans text-xs rounded-full border border-black px-2 py-0 whitespace-nowrap text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                      onclick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onServiceClick?.(serviceName)
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
{:else}
  <!-- Block and Grid Modes -->
  <article class="featured-project p-2 group hover:bg-white duration-300 transition-all rounded-lg hover:!text-black">
    <a class={displayMode === 'block' ? 'contents' : 'grid grid-cols-[1fr_4fr] gap-4'} href={project.uri}>
      <!-- Image -->
      <div class="mb-4 aspect-[4/3] {displayMode === 'block' ? 'w-full' : 'w-56'}">
        <Image {imageObject} imageSize="large" fit="cover" extraClasses="w-full" />
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
          <p class="text-sm text-gray-600">
            With/for: {clientNames} {yearDisplay ? ` ${yearDisplay}` :  ''}
          </p>
        {/if}

        <!-- Services -->
        {#if serviceNames.length > 0}
          <div class="services flex flex-row gap-2 mt-4 flex-wrap">
            {#each serviceNames as serviceName}
              {#if enableSearch && onServiceClick}
                <button 
                  class="group-hover:border-black font-sans text-sm rounded-full border border-white px-2 py-0 whitespace-nowrap hover:bg-white hover:text-black transition-colors cursor-pointer"
                  onclick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onServiceClick?.(serviceName)
                  }}
                >
                  {serviceName}
                </button>
              {:else}
                <div class="group-hover:border-black font-sans text-sm rounded-full border border-white px-2 py-0 whitespace-nowrap">{serviceName}</div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    </a>
  </article>
{/if}
