<script lang="ts">
  import type { EditorBlock } from '$lib/graphql/generated'
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import type { PageData } from './$types'
  import { onMount } from 'svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()


  const excerpt = $derived(data.excerpt)
  const clients = $derived(data.clients)
  const services = $derived(data.services)
  const yearDisplay = $derived(data.yearDisplay)
  const editorBlocks = $derived(data.editorBlocks)
  const backgroundColour = $derived(data.backgroundColour ?? 'black')
  const uri = $derived(data.uri)
  const portfolioData = $derived(data.portfolioData)
  const pageType = $derived(data.pageType)
  const title = $derived(data.title)
  const seo = $derived(data.seo)

  const isPortfolioItem = $derived(pageType === 'portfolio-item')

  onMount(() => {
    // Set up CSS custom properties for responsive sticky positioning
    const updateCSSVariables = () => {
      const isPortrait = window.innerHeight > window.innerWidth
      const stickyTop = isPortrait ? 200 : 0
      document.documentElement.style.setProperty('--portfolio-sticky-top', `${stickyTop}px`)
      
      // Handle tall sections
      const sections = document.querySelectorAll('.portfolio-section') as NodeListOf<HTMLElement>
      const viewportHeight = window.innerHeight
      
      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight
        const isTallerThanViewport = sectionHeight > viewportHeight
        
        if (isTallerThanViewport) {
          // Calculate top position so bottom of element aligns with bottom of viewport
          const topPosition = viewportHeight - sectionHeight - stickyTop
          section.style.top = `${topPosition}px`
          section.classList.add('tall-section')
        } else {
          // Use default sticky top for normal sections
          section.style.top = `${stickyTop}px`
          section.classList.remove('tall-section')
        }
      })
    }

    // Initial call with delay to ensure images are loaded
    setTimeout(updateCSSVariables, 100)
    
    // Update on resize
    window.addEventListener('resize', updateCSSVariables)
    
    // Update when images load
    const images = document.querySelectorAll('.portfolio-section img')
    images.forEach(img => {
      if (img.complete) {
        updateCSSVariables()
      } else {
        img.addEventListener('load', updateCSSVariables)
      }
    })

    return () => {
      window.removeEventListener('resize', updateCSSVariables)
      images.forEach(img => {
        img.removeEventListener('load', updateCSSVariables)
      })
    }
  })
</script>

<svelte:head></svelte:head>

<div class="portfolio-page py-24 min-h-screen bg-black !text-white  px-2">
  <h1 class="font-display text-xl lg:text-2xl alignwide my-4">
    {title}
  </h1>
  <div class="grid lg:grid-cols-[2fr_1fr] alignwide gap-7 mb-7">
    <div class="text-lg lg:text-xl">
      {@html excerpt}
    </div>
    <div class="flex flex-col gap-2">
      <!-- Clients -->
      {#if clients}
        <p class="text-sm lg:text-base text-gray-600">
          With/for:
          {#each clients as client}
            {client}
          {/each}
          {yearDisplay ? ` ${yearDisplay}` :  ''}
        </p>
      {/if}

      <!-- Services -->
      {#if services.length > 0}
        <div class="services flex flex-row gap-2 mt-4 flex-wrap">
          {#each services as service}
            <div class="group-hover:border-black font-sans text-sm rounded-full border border-white px-2 py-0 whitespace-nowrap">{service}</div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Render editor blocks from WordPress -->
  <div class="portfolio-content alignfull">
    {#each editorBlocks as block, index (block.clientId)}
      <div class="portfolio-section w-screen h-screen" style="z-index: {index + 1};" data-section-index={index}>
        <BlockRenderer {block} />
      </div>
    {/each}
  </div>
</div>

<style>
  .portfolio-content {
    position: relative;
  }

  .portfolio-section {
    min-height: 100vh;
    width: 100%;
    position: sticky;
    top: var(--portfolio-sticky-top, 0px);
    background: inherit;
    will-change: transform;
  }


  /* Tall sections keep sticky positioning but with custom top values */
  .portfolio-section.tall-section {
    position: sticky;
    /* top value is set via JavaScript for precise control */
  }

  /* Media query for better mobile handling */
  @media (orientation: portrait) {
    .portfolio-section {
      top: 200px;
    }
  }

  @media (orientation: landscape) {
    .portfolio-section {
      top: 0px;
    }
  }
</style>
