<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import { fade } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'
	import Image from '$components/atoms/Image.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	// ACF field group is exposed as `imageGallery` (camelCase of the `image_gallery` group).
	let group = $derived(
		(block as Record<string, any>).imageGallery as
			| {
					images?: { nodes?: any[] }
					intervalMs?: number | string | null
					aspectRatio?: string | null
					caption?: string | null
					fullWidth?: boolean | null
					fullHeight?: boolean | null
			  }
			| undefined
	)

	let images = $derived((group?.images?.nodes ?? []).filter((n: any) => n != null))
	let interval = $derived(Number(group?.intervalMs ?? 4000) || 4000)
	let aspectRatio = $derived(group?.aspectRatio ?? 'auto')
	let caption = $derived(group?.caption ?? '')
	let fullWidth = $derived(Boolean(group?.fullWidth))
	let fullHeight = $derived(Boolean(group?.fullHeight))

	// Two-image crossfade. The new active image fades in (0 → 1) on top of the
	// previous one (held at opacity 1) so there's no transparent/blackout frame.
	let activeIndex = $state(0)
	let previousIndex = $state(0)

	$effect(() => {
		if (images.length <= 1) return
		if (typeof window === 'undefined') return

		const id = setInterval(() => {
			previousIndex = activeIndex
			activeIndex = (activeIndex + 1) % images.length
		}, interval)

		return () => clearInterval(id)
	})

	// Stable box: every image is absolutely positioned and crossfades over a
	// container with a FIXED height. The height comes from an explicit aspect
	// ratio, or — for 'auto' — from the first image's intrinsic ratio.
	function aspectOf(image: any): string | null {
		for (const s of image?.mediaDetails?.sizes ?? []) {
			const w = parseInt(s?.width ?? '0')
			const h = parseInt(s?.height ?? '0')
			if (w > 0 && h > 0) return `${w} / ${h}`
		}
		return null
	}

	let aspectCss = $derived.by(() => {
		switch (aspectRatio) {
			case '1:1':
				return '1 / 1'
			case '16:9':
				return '16 / 9'
			case '4:3':
				return '4 / 3'
			default:
				return images.length ? aspectOf(images[0]) : null
		}
	})
</script>

{#if images.length > 0}
	<figure class="acf-image-gallery {fullWidth ? 'w-full' : 'w-auto'} {fullHeight ? 'h-full' : ''}">
		<div
			class="relative {fullHeight ? 'h-full' : ''} overflow-hidden"
			style:aspect-ratio={aspectCss ?? '3 / 2'}
		>
			{#each images as image, i (i)}
				{#if i === activeIndex || i === previousIndex}
					<div
						class="absolute inset-0 h-full w-full"
						style:z-index={i === activeIndex ? 1 : 0}
						in:fade={{ duration: 800, easing: cubicInOut }}
					>
						<Image imageObject={image} imageSize="large" fit="cover" />
					</div>
				{/if}
			{/each}
		</div>
		{#if caption}
			<figcaption class="mt-2 text-sm">{@html caption}</figcaption>
		{/if}
	</figure>
{/if}
