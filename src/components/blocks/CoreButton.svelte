<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  import Button from '$components/Button.svelte'

  // Expect a core/button block
  export let block: ExtendedEditorBlock
  const getTextClass = (fontSize: string | null) => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm'
      case 'base':
        return 'text-sm md:text-base'
      case 'lg':
        return 'text-base md:text-lg'
      case 'xl':
        return 'text-base md:text-lg lg:text-xl'
      case '2xl':
        return 'text-xl md:text-2xl'
      case null:
      default:
        return 'text-sm md:text-base'
    }
  }

  const getBackgroundClass = (backgroundColor: string | null) => {
    return backgroundColor ? `bg-${backgroundColor}` : 'bg-nhtbl-green-base'
  }

  const getBorderClass = (borderColor: string | null) => {
    return borderColor ? `border-${borderColor} border` : 'border-black border'
  }

  const getTextColorClass = (textColor: string | null) => {
    return textColor ? `text-${textColor}` : 'text-black'
  }
</script>

<Button 
  textClass={getTextClass(block.attributes?.fontSize ?? null)}
  colourClass={`${getBackgroundClass(block.attributes?.backgroundColor ?? null)} ${getBorderClass(block.attributes?.borderColor ?? null)}`}
  textColourClass={getTextColorClass(block.attributes?.textColor ?? null)}
  url={block.attributes?.url} 
  label={block.attributes?.text} 
/>
