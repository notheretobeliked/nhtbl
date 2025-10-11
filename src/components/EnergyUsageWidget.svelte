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

<button
  type="button"
  class="px-3 py-1 border-none rounded cursor-pointer transition-all duration-200 font-medium text-sm {isHD ? 'text-nhtbl-green-base' : 'text-black/50' }"
  onclick={toggleHD}
  title={isHD ? 'HD images enabled' : 'HD images disabled'}
  aria-label={isHD ? 'Disable HD images' : 'Enable HD images'}
>
  HD
</button>
