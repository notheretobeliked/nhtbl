<script lang="ts">
  import { onMount } from 'svelte'
  import type { EditorBlock } from '$lib/types/wp-types'
  import { parseContent } from '$lib/utilities/utilities' // Adjust the path as necessary
  import type { ContentSegment } from '$lib/utilities/utilities' // Adjust the path as necessary

  export let block: EditorBlock

  import Emphas from '$components/Emphas.svelte'
  const { content, fontSize, textColor, align } = block.attributes



  let segments: ContentSegment[] = [] // Initialize segments as empty

  // Moved parseContent inside onMount to ensure it's run client-side
  onMount(() => {
    segments = parseContent(content)
  })
  const classNames = (fontSize: string, textColor: string, align: string) => {
    let textClasses: string,
      alignClasses: string,
      colorClasses: string = ''
    switch (fontSize) {
      case 'base':
        textClasses = 'text-sans text-sm md:text-base'
        break
      case 'lg':
        textClasses = 'font-display text-base md:text-lg'
        break
      case 'xl':
        textClasses = 'font-display text-lg md:text-xl'
        break
      case '2xl':
        textClasses = 'font-display text-xl md:text-2xl'
        break
      case null:
        textClasses = 'text-sans text-sm md:text-base'
        break
    }
    switch (align) {
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
    if (textColor === 'nhtbl-green-base') colorClasses = `${colorClasses} group-hover:text-black transition-color`

    return `${textClasses} ${alignClasses} ${colorClasses}` // Combine base classes with spacing classes
  }
</script>

<!-- Use the class directive in Svelte to dynamically set classes -->
<p class={classNames(fontSize, textColor, align)}>
  {#each segments as { type, content, version, key } (key)}
    {#if type === 'svg'}
      <Emphas {content} {version} stroke={textColor || 'black'} />
    {:else}
      {@html content} <!-- Ensure this is safe to use -->
    {/if}
  {/each}
</p>
