<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'

  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()

  // navItems is resolved server-side (siblings or child pages of this page),
  // each with { databaseId, title, uri, isCurrent }.
  let items = $derived(
    ((block as Record<string, any>).navItems ?? []).filter((i: any) => i && i.uri)
  )
</script>

{#if items.length}
  <nav class="subpage-navigation flex flex-col gap-y-2 font-display text-lg md:text-xl">
    {#each items as item (item.databaseId)}
      <a
        href={item.uri}
        aria-current={item.isCurrent ? 'page' : undefined}
        class="transition-opacity {item.isCurrent ? 'opacity-100' : 'opacity-30 hover:opacity-60'}"
      >
        {@html item.title}
      </a>
    {/each}
  </nav>
{/if}
