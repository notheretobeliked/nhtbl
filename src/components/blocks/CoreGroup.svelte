<script lang="ts">
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import RevealText from '$components/effects/RevealText.svelte'
  import Parallax from '$components/effects/Parallax.svelte'
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  import { setContext } from 'svelte'

  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()

  let attrs = $derived((block.attributes ?? {}) as Record<string, any>)
  let children = $derived(block.children || [])
  let bgColor = $derived(attrs.backgroundColor ?? 'white')

  function presetToSpacing(value: string): string | null {
    const match = value.match(/(?:var:preset\|)?spacing\|(\d+)/)
    if (match) return String(parseInt(match[1], 10) / 10)
    return null
  }

  // blockGap → gap-* (newer Gutenberg saves { top, left }; use top/row gap).
  let gapClass = $derived.by(() => {
    const raw = attrs.style
    if (!raw) return ''
    try {
      const style = typeof raw === 'string' ? JSON.parse(raw) : raw
      const bg = style?.spacing?.blockGap
      const value =
        bg && typeof bg === 'object'
          ? ((bg as Record<string, unknown>).top ?? (bg as Record<string, unknown>).left)
          : bg
      if (value === undefined || value === null || value === '' || value === '0' || value === 0)
        return ''
      const tw = presetToSpacing(String(value))
      return tw ? `gap-${tw}` : ''
    } catch {
      return ''
    }
  })

  // Section behaviour / reveal / parallax extensions
  let behavior = $derived((attrs.behavior as string) ?? 'normal')
  let minHeight = $derived((attrs.minHeight as string) ?? 'auto')
  let contentAlign = $derived(
    (attrs.contentAlign as 'top' | 'center' | 'bottom' | 'stretch') ?? 'center'
  )
  let reveal = $derived((attrs.reveal as 'none' | 'scroll-locked' | 'once-on-enter') ?? 'none')
  let revealDirection = $derived(
    (attrs.revealDirection as 'up' | 'from-left' | 'fade-only') ?? 'up'
  )
  let revealStagger = $derived(Number(attrs.revealStagger ?? 60))
  let parallax = $derived(attrs.parallax === true)

  let hasMinHeight = $derived(minHeight === 'screen' || minHeight === 'half')

  // Fill the section (children stretch to its height) only when the author asks
  // for it via content alignment "stretch". Other alignments (center/top/bottom)
  // position the content within the section — even when the child is a Columns
  // block — so `center` actually centres it.
  let useFillLayout = $derived(hasMinHeight && contentAlign === 'stretch')

  // Cascade fill-height to descendants (CoreColumns / CoreColumn) without
  // touching BlockRenderer. setContext must run at init, so pass a $state
  // object whose `value` is updated reactively below.
  const fillCtx = $state({ value: false })
  setContext('fill-height', fillCtx)
  $effect(() => {
    fillCtx.value = useFillLayout
  })

  // When a reveal is active, tell descendant BlockRenderers (the heading /
  // paragraph children) to drop their own .block-anim fade so RevealText is the
  // sole animator — otherwise each child independently fades itself in and
  // fights the group's staggered, directional reveal. Always set it (true or
  // false) so a nested non-reveal group resets it for its own children.
  setContext('reveal-active', reveal !== 'none')

  let sectionClasses = $derived(
    minHeight === 'screen' ? 'min-h-[100svh]' : minHeight === 'half' ? 'min-h-[50svh]' : ''
  )

  let layoutClasses = $derived.by(() => {
    // No min-height set → keep the original block-flow layout (no regression
    // for existing groups). Flex/grid only kicks in for the section features.
    if (!hasMinHeight) return ''
    if (useFillLayout) return 'grid grid-cols-1 grid-rows-[1fr]'
    switch (contentAlign) {
      case 'top':
        return 'flex flex-col justify-start'
      case 'bottom':
        return 'flex flex-col justify-end'
      default:
        return 'grid grid-cols-1 content-center'
    }
  })

  let innerClasses = $derived(
    ['core-group m-auto', bgColor === 'black' ? '!text-white' : '', layoutClasses, gapClass, sectionClasses]
      .filter(Boolean)
      .join(' ')
  )
</script>

<!-- Sticky-stack is applied to the OUTER block wrapper (see app.css) because
     this group div is only as tall as its content and can't stick on its own.
     The data attribute marks it; the CSS :has() rule does the pinning. -->
<div class="px-2 md:px-0" data-section-behavior={behavior === 'stick' ? 'stick' : null}>
  {#if parallax}
    <Parallax class={innerClasses}>
      {#each children as childBlock}
        <BlockRenderer block={childBlock} />
      {/each}
    </Parallax>
  {:else if reveal !== 'none'}
    <RevealText
      class={innerClasses}
      trigger={reveal}
      direction={revealDirection}
      stagger={revealStagger}
    >
      {#each children as childBlock}
        <BlockRenderer block={childBlock} />
      {/each}
    </RevealText>
  {:else}
    <div class={innerClasses}>
      {#each children as childBlock}
        <BlockRenderer block={childBlock} />
      {/each}
    </div>
  {/if}
</div>
