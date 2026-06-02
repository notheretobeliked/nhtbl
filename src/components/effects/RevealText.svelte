<script lang="ts">
  import { inview } from 'svelte-inview'
  import type { Options, ObserverEventDetails } from 'svelte-inview'
  import type { Snippet } from 'svelte'

  interface Props {
    children?: Snippet
    class?: string
    trigger?: 'scroll-locked' | 'once-on-enter'
    direction?: 'up' | 'from-left' | 'fade-only'
    stagger?: number
  }

  let {
    children,
    class: className = '',
    trigger = 'once-on-enter',
    direction = 'up',
    stagger = 60
  }: Props = $props()

  let root = $state<HTMLDivElement>()
  let revealed = $state(false)

  const options: Options = {
    rootMargin: '-10% 0px -10% 0px',
    // once-on-enter: reveal once and stop observing. scroll-locked: keep
    // observing so it re-hides when scrolled out and replays on re-entry.
    unobserveOnEnter: trigger === 'once-on-enter'
  }

  function handleChange({ detail }: CustomEvent<ObserverEventDetails>) {
    if (trigger === 'once-on-enter') {
      if (detail.inView) revealed = true
    } else {
      revealed = detail.inView
    }
  }

  // Stagger each direct child by assigning an incremental transition-delay.
  // Children are the BlockRenderer wrappers of the group's blocks.
  $effect(() => {
    if (!root) return
    const kids = Array.from(root.children) as HTMLElement[]
    kids.forEach((kid, i) => {
      kid.style.transitionDelay = `${i * stagger}ms`
    })
  })
</script>

<div
  bind:this={root}
  class="reveal-text {className}"
  class:revealed
  data-reveal-direction={direction}
  use:inview={options}
  oninview_change={handleChange}
>
  {@render children?.()}
</div>

<style>
  /* Hidden initial state on each direct child; revealed by the `.revealed`
     class once the section scrolls into view (toggled by svelte-inview). */
  .reveal-text > :global(*) {
    opacity: 0;
    will-change: opacity, transform;
    /* Quick fade running alongside a slower slide so children pop in on
       opacity while still gliding into position. */
    transition:
      opacity 320ms ease-out,
      transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .reveal-text[data-reveal-direction='up'] > :global(*) {
    transform: translateY(1.5rem);
  }
  .reveal-text[data-reveal-direction='from-left'] > :global(*) {
    transform: translateX(-1.5rem);
  }
  .reveal-text[data-reveal-direction='fade-only'] > :global(*) {
    transform: none;
  }

  .reveal-text.revealed > :global(*) {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal-text > :global(*) {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
</style>
