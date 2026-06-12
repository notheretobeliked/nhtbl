<script lang="ts">
	import type { MediaItem, MediaSize } from '$lib/graphql/generated'
	import type { ImageSize } from '$lib/types/wp-types'
	import { getSrcSet } from '$lib/utilities/utilities'

	type ImageSizeName = string

	interface Props {
		imageObject?: MediaItem
		lazy?: boolean
		imageSize?: ImageSizeName
		fit?: 'cover' | 'contain' | 'fill' | 'none'
		extraClasses?: string
		shadow?: boolean
		// Explicit overrides — when `src` is passed, the atom renders it directly
		// (with the given srcset/dimensions) instead of selecting a named size
		// from `imageObject`. Used by CoreImage, which already knows the editor's
		// chosen url, srcset and intrinsic dimensions.
		src?: string
		srcset?: string
		width?: string | number
		height?: string | number
		alt?: string
		// Natural mode: render a single bare <img> in normal document flow
		// (no fill wrapper / h-full / spacer overlay). The caller owns layout via
		// `extraClasses` + `imgStyle`. Used by CoreImage, which already computes
		// its own alignment/aspect/border classes.
		natural?: boolean
		imgStyle?: string
	}

	let {
		imageObject,
		lazy = true,
		imageSize = 'thumbnail',
		fit = 'none',
		extraClasses = '',
		shadow = false,
		src: srcProp,
		srcset: srcsetProp,
		width: widthProp,
		height: heightProp,
		alt: altProp,
		natural = false,
		imgStyle
	}: Props = $props()

	let sizes = $derived(
		imageObject?.mediaDetails?.sizes
			?.filter((size): size is MediaSize => size !== null && typeof size.name === 'string')
			.map((size): ImageSize => ({
				sourceUrl: size.sourceUrl ?? '',
				width: parseInt(size.width ?? '0'),
				height: parseInt(size.height ?? '0'),
				name: size.name ?? ''
			})) ?? []
	)

	// Pick the requested named size; if this image doesn't have it (WP doesn't
	// generate every size for every image — e.g. small images have no `large`),
	// fall back to the largest available so the image still renders.
	let chosenSize = $derived.by(() => {
		if (srcProp) return null
		const named = sizes.find((s) => s.name === imageSize)
		if (named) return named
		return [...sizes].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0] ?? null
	})

	// Final fallback: some attachments have no generated sizes at all — use the
	// full-size sourceUrl from the node so the image still renders.
	let src = $derived(srcProp ?? chosenSize?.sourceUrl ?? imageObject?.sourceUrl ?? '')
	let width = $derived(widthProp ?? (chosenSize ? String(chosenSize.width) : ''))
	let height = $derived(heightProp ?? (chosenSize ? String(chosenSize.height) : ''))
	let altText = $derived(altProp ?? imageObject?.altText ?? '')
	let srcsetAttr = $derived(srcProp ? (srcsetProp ?? '') : getSrcSet(sizes))

	function determineSizes(sizeName: ImageSizeName): string {
		switch (sizeName) {
			case 'thumbnail':
				return '(max-width: 600px) 50vw, (max-width: 1200px) 50vw, 25vw'
			case 'medium':
				return '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
			case 'medium_large':
				return '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
			case 'large':
				return '(max-width: 1200px) 100vw, 50vw'
			default:
				return '100vw'
		}
	}

	let srcsetLabels = $derived(srcProp ? '100vw' : determineSizes(imageSize))
</script>
{#if natural}
  <!-- Bare image in normal flow; caller owns layout via extraClasses/imgStyle. -->
  <img
    loading={lazy ? 'lazy' : 'eager'}
    class={`${shadow ? 'drop-shadow-lg ' : ''}${extraClasses}`.trim()}
    style={imgStyle || undefined}
    {src}
    alt={altText}
    {width}
    {height}
    srcset={srcsetAttr || undefined}
    sizes={srcsetAttr ? srcsetLabels : undefined}
  />
{:else}
<div class="relative w-full h-full max-w-none flex justify-center">
  <img
    loading={lazy ? 'lazy' : 'eager'}
    class={`${fit === 'contain' ? 'w-auto' : 'w-full'} h-full object-${fit} ${shadow ? 'drop-shadow-lg' : ''} ${extraClasses}`}
    {src}
    alt={altText}
    {width}
    {height}
    srcset={srcsetAttr || undefined}
    sizes={srcsetAttr ? srcsetLabels : undefined}
  />
</div>
{/if}
