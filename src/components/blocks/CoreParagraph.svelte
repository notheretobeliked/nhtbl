<script lang="ts">
  import { onMount } from 'svelte'
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  import { parseContent } from '$lib/utilities/utilities' // Adjust the path as necessary
  import type { ContentSegment } from '$lib/utilities/utilities' // Adjust the path as necessary

  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()
  
  import Emphas from '$components/Emphas.svelte'
  const { content, fontSize, textColor, align, fontFamily } = block.attributes || {}

  let segments = $state<ContentSegment[]>([]) // Initialize segments as empty

  // Moved parseContent inside onMount to ensure it's run client-side
  onMount(() => {
    segments = parseContent(content)
  })
  const classNames = (fontSize: string, textColor: string, align: string, fontFamily: string) => {
    let textClasses: string,
      alignClasses: string,
      colorClasses: string = ''
    
    // Handle custom font family
    let fontClass = ''
    if (fontFamily) {
      fontClass = `font-${fontFamily}`
    } else {
      // Use predefined font families based on fontSize
      switch (fontSize) {
        case 'base':
          fontClass = 'font-sans'
          break
        case 'lg':
        case 'xl':
        case '2xl':
          fontClass = 'font-display'
          break
        case null:
        default:
          fontClass = 'font-sans'
          break
      }
    }
    
    // Handle font size classes
    switch (fontSize) {
      case 'base':
        textClasses = `${fontClass} text-sm md:text-base`
        break
      case 'lg':
        textClasses = `${fontClass} text-base md:text-lg`
        break
      case 'xl':
        textClasses = `${fontClass} text-lg md:text-xl`
        break
      case '2xl':
        textClasses = `${fontClass} text-xl md:text-2xl`
        break
      case null:
      default:
        textClasses = `${fontClass} text-sm md:text-base`
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
<p class="{classNames(fontSize, textColor, align, fontFamily)} mb-2">
  {#each segments as { type, content, version, key } (key)}
    {#if type === 'svg'}
      <Emphas {content} {version} stroke={textColor || 'black'} />
    {:else}
      {@html content} <!-- Ensure this is safe to use -->
    {/if}
  {/each}
</p>
