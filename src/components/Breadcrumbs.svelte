<script lang="ts">
  import type { BreadcrumbItem } from '$lib/types/wp-types'
  
  interface Props {
    breadcrumbs: BreadcrumbItem[]
    class?: string
  }
  
  let { breadcrumbs, class: className = '' }: Props = $props()
  
  // Filter out empty breadcrumbs and ensure we have valid data
  const validBreadcrumbs = $derived(
    breadcrumbs?.filter(crumb => crumb?.text?.trim()) || []
  )
  
  // Don't render if we don't have valid breadcrumbs
  const shouldRender = $derived(validBreadcrumbs.length > 0)
</script>

{#if shouldRender}
  <nav aria-label="Breadcrumb" class="breadcrumbs {className}">
    <ol class="flex items-center md:space-x-1 text-sm text-gray-600">
      {#each validBreadcrumbs as crumb, index}
        <li class="flex items-center flex-nowrap">
          {#if index > 0}
            <svg 
              class="w-4 h-4 mx-2 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fill-rule="evenodd" 
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                clip-rule="evenodd" 
              />
            </svg>
          {/if}
         
          {#if crumb.url && index == 0}
            <!-- First item -->
            <a 
              href={crumb.url} 
              class="hover:text-gray-900 transition-colors"
              aria-current={index === validBreadcrumbs.length - 1 ? 'page' : undefined}
            >
              <img src="/Nhtbl-logo.webp" alt="A happy earth with smiley layered on top" class="h-6 w-6 max-w-none"/>
            </a>
          {:else if crumb.url && index < validBreadcrumbs.length - 1}
            <!-- Linked breadcrumb (not the last item) -->
            <a 
              href={crumb.url} 
              class="hover:text-gray-900 transition-colors"
              aria-current={index === validBreadcrumbs.length - 1 ? 'page' : undefined}
            >
              {@html crumb.text}
            </a>
          {:else}
            <!-- Current page (last item) or non-linked item -->
            <span 
              class="font-medium text-gray-900 whitespace-nowrap"
              aria-current={index === validBreadcrumbs.length - 1 ? 'page' : undefined}
            >
            {@html crumb.text}
            </span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}

<style>
  .breadcrumbs {
    @apply py-2;
  }
</style>
