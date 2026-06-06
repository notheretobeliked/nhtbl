<script lang="ts">
  import { onMount } from 'svelte'
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

  let root: HTMLDivElement | undefined = $state()

  const SKIP_SELECTORS = 'button, .wp-block-button__link, [data-reveal-skip], a.wp-element-button'

  // Wrap every word in the subtree in a <span data-reveal-word style="--i:n">
  // so it can be revealed individually. Whitespace is preserved as plain text
  // nodes; buttons/links and already-split spans are skipped.
  function splitTextNodes(el: HTMLElement): number {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT
        const parent = node.parentElement
        if (!parent) return NodeFilter.FILTER_REJECT
        if (parent.closest(SKIP_SELECTORS)) return NodeFilter.FILTER_REJECT
        if ((parent as HTMLElement).dataset?.revealWord !== undefined) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      }
    })

    const textNodes: Text[] = []
    let node: Node | null
    while ((node = walker.nextNode())) textNodes.push(node as Text)

    let counter = 0
    for (const tn of textNodes) {
      const text = tn.textContent ?? ''
      const tokens = text.split(/(\s+)/) // keep whitespace as separate tokens
      const frag = document.createDocumentFragment()
      for (const token of tokens) {
        if (!token) continue
        if (/^\s+$/.test(token)) {
          frag.appendChild(document.createTextNode(token))
        } else {
          const span = document.createElement('span')
          span.dataset.revealWord = ''
          span.style.setProperty('--i', String(counter++))
          span.textContent = token
          frag.appendChild(span)
        }
      }
      tn.replaceWith(frag)
    }

    return counter
  }

  onMount(() => {
    if (!root) return
    if (typeof window === 'undefined') return

    const wordCount = splitTextNodes(root)
    if (wordCount === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('reveal-shown')
      root
        .querySelectorAll<HTMLSpanElement>('[data-reveal-word]')
        .forEach((w) => w.classList.add('reveal-word-visible'))
      return
    }

    if (trigger === 'once-on-enter') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            root!.classList.add('reveal-shown')
            observer.disconnect()
          }
        },
        { threshold: 0.2 }
      )
      observer.observe(root)
      return () => observer.disconnect()
    }

    // scroll-locked: reveal words progressively as the element scrolls up.
    const words = Array.from(root.querySelectorAll<HTMLSpanElement>('[data-reveal-word]'))
    let frame = 0

    const update = () => {
      frame = 0
      if (!root) return
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the top of the element enters the viewport from below
      // (rect.top = vh). 1 well before it exits the top — multiplier 0.4 so the
      // reveal completes around the upper third rather than the centre. ceil()
      // so the last word isn't stranded when scroll stops a hair short of 1.
      const range = (rect.height + vh) * 0.4
      const traversed = vh - rect.top
      const progress = Math.max(0, Math.min(1, traversed / range))
      const visibleCount = Math.ceil(progress * words.length)
      for (let i = 0; i < words.length; i++) {
        if (i < visibleCount) words[i].classList.add('reveal-word-visible')
        else words[i].classList.remove('reveal-word-visible')
      }
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  })
</script>

<div
  bind:this={root}
  class="reveal-text {className}"
  data-reveal-trigger={trigger}
  data-reveal-direction={direction}
  style:--reveal-stagger="{stagger}ms"
>
  {@render children?.()}
</div>

<style>
  :global(.reveal-text [data-reveal-word]) {
    display: inline-block;
    opacity: 0;
    transform: translateY(0.5em);
    transition:
      opacity 600ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* once-on-enter: stagger via per-word transition-delay; visibility toggled
     when the wrapper gains .reveal-shown */
  :global(.reveal-text[data-reveal-trigger='once-on-enter'] [data-reveal-word]) {
    transition-delay: calc(var(--i, 0) * var(--reveal-stagger, 60ms));
  }
  :global(.reveal-text[data-reveal-trigger='once-on-enter'].reveal-shown [data-reveal-word]) {
    opacity: 1;
    transform: translateY(0);
  }

  /* scroll-locked: per-word visibility toggled by JS as scroll advances */
  :global(.reveal-text[data-reveal-trigger='scroll-locked'] [data-reveal-word].reveal-word-visible) {
    opacity: 1;
    transform: translateY(0);
  }

  /* direction: from-left */
  :global(.reveal-text[data-reveal-direction='from-left'] [data-reveal-word]) {
    transform: translateX(-0.75em);
  }
  :global(
      .reveal-text[data-reveal-direction='from-left'][data-reveal-trigger='once-on-enter'].reveal-shown [data-reveal-word],
      .reveal-text[data-reveal-direction='from-left'][data-reveal-trigger='scroll-locked'] [data-reveal-word].reveal-word-visible
    ) {
    transform: translateX(0);
  }

  /* direction: fade-only */
  :global(.reveal-text[data-reveal-direction='fade-only'] [data-reveal-word]) {
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.reveal-text [data-reveal-word]) {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
