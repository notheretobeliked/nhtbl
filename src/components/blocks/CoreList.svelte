<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  import CoreListItem from './CoreListItem.svelte'

  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()
  let attrs = $derived((block.attributes ?? {}) as Record<string, any>)
  let isOrdered = $derived(Boolean(attrs.ordered))

  // Render the list items directly (not through BlockRenderer): BlockRenderer
  // wraps every block in <div>s, which is invalid markup inside <ul>/<ol>.
  let items = $derived((block.children ?? []).filter((c: any) => c?.name === 'core/list-item'))
</script>

{#if isOrdered}
  <ol
    class="list-decimal list-outside pl-6 mb-2"
    type={attrs.type || undefined}
    start={attrs.start || undefined}
    reversed={attrs.reversed || undefined}
  >
    {#each items as item}
      <CoreListItem block={item} />
    {/each}
  </ol>
{:else}
  <ul class="list-disc list-outside pl-6 mb-2">
    {#each items as item}
      <CoreListItem block={item} />
    {/each}
  </ul>
{/if}
