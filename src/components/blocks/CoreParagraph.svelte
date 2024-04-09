<script lang="ts">
  interface ContentSegment {
    type: 'text' | 'svg'
    content: string
    version: 'line' | 'bubble' // Add this line
  }

  import { onMount } from 'svelte'
  import type { EditorBlock } from '$lib/types/wp-types'
  export let block: EditorBlock
  
  import Emphas from '$components/Emphas.svelte'
  const { content, fontSize, textColor, align } = block.attributes

  function parseContent(htmlContent: string): ContentSegment[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const segments: ContentSegment[] = []

    doc.body.childNodes.forEach(node => {
      if (node.nodeName === 'SPAN' && node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        // Check if the span has an underline style
        if (element.style.textDecoration.includes('underline')) {
          // This span is underlined, use its innerHTML or innerText based on your needs
          // innerHTML if you expect nested formatting within the span,
          // innerText if you just need the text without any HTML tags.
          segments.push({ type: 'svg', content: element.innerHTML, version: 'line' })
        } else {
          // For spans without underline, or other styling, consider how you want to handle these
          segments.push({ type: 'text', content: element.outerHTML, version: 'bubble' })
        }
      } else if (node.nodeName === 'STRONG') {
        segments.push({ type: 'svg', content: node.textContent || '', version: 'bubble' })
      } else if (node.nodeType === Node.TEXT_NODE) {
        segments.push({ type: 'text', content: node.textContent || '', version: 'bubble' })
      } else {
        // Handle other HTML elements or node types as needed
        segments.push({ type: 'text', content: node.textContent || '', version: 'bubble' })
      }
    })

    return segments
  }

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
  {#each segments as segment (segment.content)}
    {#if segment.type === 'svg'}
      <Emphas content={segment.content} version={segment.version} stroke={textColor?? 'black' } />
    {:else}
      {@html segment.content} <!-- Note: `sanitizeHtml` should make this safe -->
    {/if}
  {/each}
</p>
