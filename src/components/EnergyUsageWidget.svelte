<script lang="ts">
  import { energyUsage } from '$lib/stores/energyUsage.svelte.js'

  interface Props {
    compact?: boolean // For different header layouts
  }

  let { compact = false }: Props = $props()

  const isHD = $derived(energyUsage.mode === 'high')

  const toggleHD = () => {
    energyUsage.mode = energyUsage.mode === 'high' ? 'low' : 'high'
  }
</script>

{#if compact}
  <button
    type="button"
    class="px-3 py-1 border-none rounded cursor-pointer transition-all duration-200 font-medium text-sm {isHD ? 'text-nhtbl-green-base' : 'text-black/50'}"
    onclick={toggleHD}
    title={isHD ? 'HD images enabled' : 'HD images disabled'}
    aria-label={isHD ? 'Disable HD images' : 'Enable HD images'}
  >
    HD
  </button>
{:else}
  <div class="flex flex-row gap-2 items-center">
    <span>Enable high resolution images: </span>
    <button
      type="button"
      class="relative w-10 h-5 rounded-full border border-black bg-transparent cursor-pointer transition-all duration-300 flex items-center p-0.5"
      onclick={toggleHD}
      title={isHD ? 'HD images enabled' : 'HD images disabled'}
      aria-label={isHD ? 'Disable HD images' : 'Enable HD images'}
      aria-checked={isHD}
      role="switch"
    >
      <div class="w-4 h-4 rounded-full border-black/20 border bg-nhtbl-green-base transition-transform duration-300 {isHD ? 'translate-x-4' : 'translate-x-0'}"></div>
    </button>
  </div>
  <p class="italic text-sm mt-2">Will consume more energy and bandwidth</p>
{/if}
