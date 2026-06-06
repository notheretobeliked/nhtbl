<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'

  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()
  const attrs = (block.attributes || {}) as Record<string, any>

  function parseStyle(raw: unknown): Record<string, any> {
    if (!raw) return {}
    if (typeof raw === 'object') return raw as Record<string, any>
    try {
      return JSON.parse(String(raw))
    } catch {
      return {}
    }
  }

  function isUnset(v: unknown): boolean {
    return v == null || v === '' || v === '0' || v === '0px'
  }

  // Normalise a height value to valid CSS:
  //  - spacing-preset token (var:preset|spacing|N) → its CSS custom property
  //  - bare number (e.g. "100") → px
  //  - already-valid value (e.g. "100px", "8rem") → as-is
  function resolveHeight(raw: unknown): string {
    if (raw == null || raw === '') return '5px'
    const v = String(raw).trim()
    const preset = v.match(/^var:preset\|spacing\|(.+)$/)
    if (preset) return `var(--wp--preset--spacing--${preset[1]})`
    if (/^\d+(\.\d+)?$/.test(v)) return `${v}px`
    return v
  }

  // Inside a flex/stack layout WordPress leaves `height` at "0px" and stores the
  // real size in style.layout.flexSize — fall back to that when height is unset.
  const flexSize = parseStyle(attrs.style)?.layout?.flexSize
  const height = resolveHeight(isUnset(attrs.height) && flexSize ? flexSize : attrs.height)
</script>

<div aria-hidden="true" style="height:{height}"></div>
