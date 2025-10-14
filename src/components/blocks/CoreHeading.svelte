<script lang="ts">
  import { onMount } from 'svelte'
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  import Emphas from '$components/Emphas.svelte'

  import { parseContent } from '$lib/utilities/utilities' // Adjust the path as necessary
  import type { ContentSegment } from '$lib/utilities/utilities' // Adjust the path as necessary
  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()
  const { content, fontSize, textColor, textAlign, level } = block.attributes || {}

  let segments = $state<ContentSegment[]>([])
  let hasSvg = $state(false) // Variable to track presence of 'svg' type segments

  onMount(() => {
    segments = parseContent(content!)
    hasSvg = segments.some(segment => segment.type === 'svg' && segment.version === 'bubble')
  })

  const classNames = (fontSize: string, textColor: string, textAlign: string) => {
    let textClasses: string,
      alignClasses: string,
      colorClasses: string = ''
    switch (fontSize) {
      case 'base':
        textClasses = 'text-sm md:text-base'
        break
      case 'lg':
        textClasses = 'text-base md:text-lg'
        break
      case 'xl':
        textClasses = 'text-lg md:text-xl'
        break
      case '2xl':
        textClasses = 'text-xl md:text-2xl'
        break
      case null:
        textClasses = 'text-sm md:text-base'
        break
    }
    switch (textAlign) {
      case 'center':
        alignClasses = 'text-center'
        break
      case 'left':
        alignClasses = 'text-left'
        break
      case 'right':
        alignClasses = 'text-right'
        break
      case null:
        alignClasses = 'text-left'
        break
    }
    colorClasses = `text-${textColor}`
    if (textColor === 'nhtbl-green-base') colorClasses = `${colorClasses} group-hover:text-black transition-color duration-300`

    return `${textClasses} ${alignClasses} ${colorClasses}` // Combine base classes with spacing classes
  }
</script>

{#if level === 1}
  <h1 class="{classNames(fontSize, textColor, textAlign)} font-display {hasSvg && 'ml-6 md:ml-0'}">
    {#each segments as { type, content, version, key } (key)}
      {#if type === 'svg'}
        <Emphas {content} {version} stroke={textColor || 'black'} />
      {:else}
        {@html content} <!-- Ensure this is safe to use -->
      {/if}
    {/each}
  </h1>
{/if}
{#if level === 2}
  <h2 class="{classNames(fontSize, textColor, textAlign)}  font-display mb-2 {hasSvg && 'ml-6 md:ml-0'}">
    {#each segments as { type, content, version, key } (key)}
      {#if type === 'svg'}
        <Emphas {content} {version} stroke={textColor || 'black'} />
      {:else}
        {@html content} <!-- Ensure this is safe to use -->
      {/if}
    {/each}
  </h2>
{/if}
{#if level === 3}
  <h3 class="{classNames(fontSize, textColor, textAlign)}  font-display {hasSvg && 'ml-6 md:ml-0'}">
    {#each segments as { type, content, version, key } (key)}
      {#if type === 'svg'}
        <Emphas {content} {version} stroke={textColor || 'black'} />
      {:else}
        {@html content} <!-- Ensure this is safe to use -->
      {/if}
    {/each}
  </h3>
{/if}
