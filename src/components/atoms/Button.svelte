<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  interface Props {
    /*
    this is a generic button 
  */
    label?: string
    url?: string
    active?: boolean
    textClass?: string
    fullWidth?: boolean
    colourClass?: string // Assuming this is a default style
    textColourClass?: string // Assuming this is a default style
    shrink?: boolean // New prop to explicitly control shrinking behavior
    selfAlign?: string // New prop to control self-alignment in flex containers
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset' | 'nav'
  }

  let {
    label = 'Read more',
    url = '/',
    active = false,
    textClass = 'text-sm uppercase text-center',
    fullWidth = false,
    colourClass = 'bg-black',
    textColourClass = 'text-yellow',
    shrink = false, // Default to false to maintain backward compatibility
    selfAlign = '', // Default to empty string
    disabled = false,
    type = 'button',
  }: Props = $props()

  function handleClick(event: MouseEvent) {
    if (url === '#') {
      event.preventDefault()
    }
    dispatch('click', event)
  }

  const baseClasses = `${colourClass} uppercase font-semibold text-center rounded-lg border-black transition-all duration-500 hover:bg-yellow hover:text-black hover:border-black py-2 px-4 border ${textClass} ${textColourClass} cursor-pointer ${fullWidth ? 'w-full block text-center' : 'inline-block w-fit'} ${shrink ? 'flex-shrink-0 flex-grow-0' : ''} ${selfAlign}`
</script>

{#if type === 'submit'}
  <button {type} {disabled} class={baseClasses} onclick={handleClick}>
    {label}
  </button>
{:else if type ==="button"}
  <a href={url} onclick={handleClick} class={baseClasses} role="button">
    {label}
  </a>
  {:else if type ==="nav"}
  <a href={url} onclick={handleClick} class="font-sans text-xl lg:text-lg {active ? 'border-nhtbl-green-base' : 'border-b-transparent hover:border-b-nhtbl-purple-base' } border-b-4 pb-1" role="button">
    {label}
  </a>
{/if}
