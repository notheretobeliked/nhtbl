<script lang="ts">
	import type { MediaItem, MediaSize } from '$lib/graphql/generated'
	import type { ImageSize } from '$lib/types/wp-types'
	import { findImageSizeData, getSrcSet } from '$lib/utilities/utilities'

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
		alt: altProp
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

	let src = $derived(srcProp ?? findImageSizeData('sourceUrl', sizes, imageSize))
	let width = $derived(widthProp ?? findImageSizeData('width', sizes, imageSize))
	let height = $derived(heightProp ?? findImageSizeData('height', sizes, imageSize))
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
  <img 
    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    class="absolute inset-0 w-full h-full"
    alt=""
    {width}
    {height}
  />
</div>
