<script lang="ts">
  import { energyUsage } from '$lib/stores/energyUsage.svelte.js'
</script>

<div class="fixed top-20 right-4 bg-red-500 text-white p-4 z-50">
  <h3>Energy Debug</h3>
  <p>Mode: {energyUsage.mode}</p>
  <p>Is None: {energyUsage.isNone}</p>
  <p>Is Low: {energyUsage.isLow}</p>
  <p>Is High: {energyUsage.isHigh}</p>
</div>