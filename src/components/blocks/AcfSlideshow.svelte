<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import { fade } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'
	import AcfSlide from './AcfSlide.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	// ACF config group + the inner acf/slide blocks (assembled into children by
	// flatListToHierarchical from the flat editorBlocks list).
	let config = $derived((block as Record<string, any>).slideshow ?? {})
	let slides = $derived(((block as any).children ?? []).filter((c: any) => c?.name === 'acf/slide'))
	let autoplay = $derived(config.autoplay !== false)
	let interval = $derived(Number(config.intervalMs ?? 5000) || 5000)
	let showNav = $derived(config.showNavigation !== false)
	let aspectRatio = $derived((config.aspectRatio ?? 'auto') as string)

	let total = $derived(slides.length)
	let activeIndex = $state(0)
	let previousIndex = $state(0)

	// Fixed-height box so the crossfade has no layout shift. Explicit ratio, or —
	// for 'auto' — the first slide's intrinsic ratio.
	function aspectOfSlide(slide: any): string | null {
		for (const s of slide?.slide?.image?.node?.mediaDetails?.sizes ?? []) {
			const w = parseInt(s?.width ?? '0')
			const h = parseInt(s?.height ?? '0')
			if (w > 0 && h > 0) return `${w} / ${h}`
		}
		return null
	}

	// A "<n>vh" value sets a fixed viewport height instead of an aspect ratio
	// (e.g. 80vh leaves room for content above the fold).
	let heightCss = $derived(/^\d+vh$/.test(aspectRatio) ? aspectRatio : null)

	let aspectCss = $derived.by(() => {
		if (heightCss) return null
		switch (aspectRatio) {
			case '1:1':
				return '1 / 1'
			case '16:9':
				return '16 / 9'
			case '4:3':
				return '4 / 3'
			case '3:2':
				return '3 / 2'
			default:
				return total ? aspectOfSlide(slides[0]) : null
		}
	})

	function goTo(i: number) {
		if (i === activeIndex) return
		previousIndex = activeIndex
		activeIndex = i
		restart()
	}

	let timer: ReturnType<typeof setInterval> | null = null
	function stop() {
		if (timer) {
			clearInterval(timer)
			timer = null
		}
	}
	function start() {
		if (autoplay && total > 1) {
			timer = setInterval(() => {
				previousIndex = activeIndex
				activeIndex = (activeIndex + 1) % total
			}, interval)
		}
	}
	function restart() {
		stop()
		start()
	}

	$effect(() => {
		if (typeof window === 'undefined') return
		start()
		return stop
	})
</script>

{#if total > 0}
	<div
		class="acf-slideshow relative w-full overflow-hidden"
		style:aspect-ratio={heightCss ? undefined : (aspectCss ?? '3 / 2')}
		style:height={heightCss ?? undefined}
	>
		<!-- The new active slide fades in on top (z-1) of the previous one (held at
		     full opacity, z-0) so there's no background flash during the crossfade. -->
		{#each slides as slide, i (slide.clientId ?? i)}
			{#if i === activeIndex || i === previousIndex}
				<div
					class="absolute inset-0"
					style:z-index={i === activeIndex ? 1 : 0}
					in:fade={{ duration: 700, easing: cubicInOut }}
				>
					<AcfSlide block={slide} />
				</div>
			{/if}
		{/each}

		{#if showNav && total > 1}
			<div class="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3">
				{#each slides as _, i}
					<button
						class="h-4 w-4 md:h-5 md:w-5 rounded-full border border-nhtbl-green-base/70 transition-colors {i === activeIndex
							? 'bg-nhtbl-green-base'
							: 'bg-transparent hover:bg-nhtbl-green-base/40'}"
						onclick={() => goTo(i)}
						aria-label="Go to slide {i + 1}"
					></button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
