<script lang="ts">
	import type { MediaItem, MediaSize } from '$lib/graphql/generated'
	import type { ImageSize } from '$lib/types/wp-types'
	import { findImageSizeData, getSrcSet } from '$lib/utilities/utilities'
	import { energyUsage } from '$lib/stores/energyUsage.svelte.js'
	import { onMount } from 'svelte'
	
	type ImageSizeName = 'thumbnail' | 'small' | 'medium' | 'medium_large' | 'large' | 'x_large'
	interface Props {
		imageObject: MediaItem;
		lazy?: boolean;
		imageSize?: ImageSizeName;
		fit?: 'cover' | 'contain' | 'fill' | 'none';
		extraClasses?: string;
		shadow?: boolean;
		aspect?: 'square' | 'video' | 'auto'
	}

	let {
		imageObject,
		lazy = true,
		imageSize = 'thumbnail',
		fit = 'none',
		extraClasses = '',
		shadow = false,
		aspect = 'auto'
	}: Props = $props();

	let containerElement: HTMLDivElement
	let containerWidth = $state(0)

	// Measure container width with multiple attempts
	onMount(() => {
		const measureContainer = () => {
			if (containerElement) {
				const width = containerElement.offsetWidth
				if (width > 0) {
					containerWidth = width
					return true
				}
			}
			return false
		}

		// Try immediate measurement
		if (!measureContainer()) {
			// If that fails, try after a brief delay
			setTimeout(() => {
				if (!measureContainer()) {
					// If still failing, try after DOM settles
					requestAnimationFrame(() => {
						measureContainer()
					})
				}
			}, 10)
		}
	})

	// Smart size selection based on container width and energy mode
	const getOptimalImageSize = (containerWidth: number, energyMode: string): ImageSizeName => {
		const sizeMap: { name: ImageSizeName; maxWidth: number }[] = [
			{ name: 'thumbnail', maxWidth: 300 },
			{ name: 'small', maxWidth: 600 },
			{ name: 'medium', maxWidth: 900 },
			{ name: 'medium_large', maxWidth: 1200 },
			{ name: 'large', maxWidth: 1600 },
			{ name: 'x_large', maxWidth: 2400 }
		]

		if (energyMode === 'none') return 'thumbnail'
		
		// Simple rule: low energy always uses thumbnail
		if (energyMode === 'low') return 'thumbnail'

		// For high energy mode, use container-aware sizing
		if (containerWidth === 0) {
			return 'medium' // Default for high energy when no measurement
		}

		// Find ideal size based on actual container width
		let idealIndex = sizeMap.findIndex(size => size.maxWidth >= containerWidth)
		
		// If container is larger than our biggest size, use the biggest
		if (idealIndex === -1) {
			idealIndex = sizeMap.length - 1
		}

		// 2x scaling for high energy: go 1-2 steps larger for crisp display
		const highIndex = Math.min(idealIndex + 1, sizeMap.length - 1)
		return sizeMap[highIndex].name
	}

	const sizes = $derived(() => {
		return imageObject?.mediaDetails?.sizes
			?.filter((size): size is MediaSize => size !== null && typeof size.name === 'string')
			.map(size => ({
				sourceUrl: size.sourceUrl ?? '',
				width: parseInt(size.width ?? '0'),
				height: parseInt(size.height ?? '0'),
				name: size.name as ImageSize['name']
			})) ?? []
	})

	// Always use low quality for initial render (SSR + hydration safety)
	const initialImageSize = $derived(() => {
		return energyUsage.isNone ? null : 'thumbnail'
	})

	// Smart energy-aware image sizing for current mode
	const optimalImageSize = $derived(() => {
		const optimalSize = getOptimalImageSize(containerWidth, energyUsage.mode)
		return energyUsage.isNone ? null : optimalSize
	})

	// Current src based on energy mode (for hydrated state) or thumbnail (for SSR)
	const currentSrc = $derived(() => {
		const size = (energyUsage as any).isHydrated ? optimalImageSize() : initialImageSize()
		return size ? findImageSizeData('sourceUrl', sizes(), size) : null
	})

	// Current srcset based on energy mode (for hydrated state) or low quality (for SSR)
	const currentSrcSet = $derived(() => {
		const size = (energyUsage as any).isHydrated ? optimalImageSize() : initialImageSize()
		if (!size) return ''
		
		const sizeOrder: ImageSizeName[] = ['thumbnail', 'small', 'medium', 'medium_large', 'large', 'x_large']
		const maxSizeIndex = sizeOrder.indexOf(size)
		
		if (maxSizeIndex === -1) return getSrcSet(sizes())
		
		// Only include sizes up to and including our calculated optimal size
		const allowedSizes = sizeOrder.slice(0, maxSizeIndex + 1)
		const filteredSizes = sizes().filter(s => allowedSizes.includes(s.name as ImageSizeName))
		
		return getSrcSet(filteredSizes)
	})

	// Data attributes for SEO - all available sizes
	const dataSrcHigh = $derived(() => {
		return findImageSizeData('sourceUrl', sizes(), 'large')
	})

	const dataSrcsetHigh = $derived(() => {
		const sizeOrder: ImageSizeName[] = ['medium', 'medium_large', 'large', 'x_large']
		const highQualitySizes = sizes().filter(s => sizeOrder.includes(s.name as ImageSizeName))
		return getSrcSet(highQualitySizes)
	})

	const dataSrcsetLow = $derived(() => {
		const sizeOrder: ImageSizeName[] = ['thumbnail', 'small']
		const lowQualitySizes = sizes().filter(s => sizeOrder.includes(s.name as ImageSizeName))
		return getSrcSet(lowQualitySizes)
	})
	
	const width = $derived(() => {
		// Always use 'large' size for width/height attributes to reserve proper layout space
		return findImageSizeData('width', sizes(), 'large')
	})
	
	const height = $derived(() => {
		// Always use 'large' size for width/height attributes to reserve proper layout space
		return findImageSizeData('height', sizes(), 'large')
	})

	const altText = imageObject.altText ?? ''
	
	// Use dominant color as background, fallback to secondary, then default
	// In 'none' mode, only use the image colors (no default fallback)
	const backgroundColor = $derived(() => {
		const palette = imageObject?.colorPalette
		const dominant = imageObject?.dominantColor
		const secondary = imageObject?.secondaryColor
		
		// If we have a palette with colors, create a gradient
		if (palette && Array.isArray(palette) && palette.length > 0) {
			const colors = palette.filter(c => c)
			if (colors.length >= 2) {
				return `linear-gradient(135deg, ${colors.join(', ')})`
			}
		}
		
		// Fallback to solid color
		if (energyUsage.isNone) {
			return dominant || secondary || 'transparent'
		}
		return dominant || secondary || '#f3e5f5'
	})

	function determineSizes(sizeName: ImageSizeName): string {
		switch (sizeName) {
			case 'thumbnail':
				return '(max-width: 400px) 75vw, (max-width: 800px) 50vw, 300px'
			case 'small':
				return '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 600px'
			case 'medium':
				return '(max-width: 600px) 100vw, (max-width: 1200px) 75vw, 900px'
			case 'medium_large':
				return '(max-width: 768px) 100vw, (max-width: 1400px) 85vw, 1200px'
			case 'large':
				return '(max-width: 1024px) 100vw, 1600px'
			case 'x_large':
				return '100vw'
			default:
				return '100vw'
		}
	}

	const srcsetLabels = $derived(() => {
		const size = (energyUsage as any).isHydrated ? optimalImageSize() : initialImageSize()
		return size ? determineSizes(size) : determineSizes(imageSize)
	})


</script>
<div bind:this={containerElement} class="image-container relative w-full max-w-none flex justify-center overflow-hidden {aspect === 'square' ? 'aspect-square' : `h-full aspect-${aspect}`}" style="--bg-color: {backgroundColor()}">
  {#if energyUsage.isNone}
    <!-- No image mode: transparent image with background color -->
    <img
      loading={lazy ? 'lazy' : 'eager'}
      class={`${fit === 'contain' ? 'w-auto' : 'w-full'} h-full ${
        fit === 'cover' ? 'object-cover' : 
        fit === 'contain' ? 'object-contain' : 
        fit === 'fill' ? 'object-fill' : 
        'object-none'
      } ${shadow ? 'drop-shadow-lg' : ''} ${extraClasses}`}
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='{width()}' height='{height()}'%3E%3C/svg%3E"
      alt={altText || 'Image placeholder (energy saving mode)'}
      width={width()}
      height={height()}
      title="Images disabled for energy saving"
      data-src-high={dataSrcHigh()}
      data-srcset-high={dataSrcsetHigh()}
      data-srcset-low={dataSrcsetLow()}
    />
  {:else}
    <!-- Normal image rendering for low/high energy modes -->
    <img
      loading={lazy ? 'lazy' : 'eager'}
      class={`${fit === 'contain' ? 'w-full' : 'w-full'} h-full ${
        fit === 'cover' ? 'object-cover' : 
        fit === 'contain' ? 'object-contain' : 
        fit === 'fill' ? 'object-fill' : 
        'object-none'
      } ${shadow ? 'drop-shadow-lg' : ''} ${extraClasses}`}
      src={currentSrc()}
      alt={altText}
      width={width()}
      height={height()}
      srcset={currentSrcSet()}
      sizes={srcsetLabels()}
      data-src-high={dataSrcHigh()}
      data-srcset-high={dataSrcsetHigh()}
      data-srcset-low={dataSrcsetLow()}
    />
  {/if}
</div>

<style>
  .image-container {
    position: relative;
  }
  
  .image-container::before {
    content: '';
    position: absolute;
    top: -50px;
    left: -50px;
    right: -50px;
    bottom: -50px;
    background: var(--bg-color);
    filter: blur(40px);
    z-index: 0;
    pointer-events: none;
  }
  
  .image-container img {
    position: relative;
    z-index: 1;
  }
</style>
