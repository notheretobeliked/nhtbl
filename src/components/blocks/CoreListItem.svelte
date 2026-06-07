<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  import CoreList from './CoreList.svelte'

  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()
  let attrs = $derived((block.attributes ?? {}) as Record<string, any>)
  let content = $derived((attrs.content ?? '') as string)

  // A list item can contain a nested list (core/list child).
  let nestedLists = $derived((block.children ?? []).filter((c: any) => c?.name === 'core/list'))
</script>

<li class="mb-1">
  {@html content}
  {#each nestedLists as list}
    <CoreList block={list} />
  {/each}
</li>
