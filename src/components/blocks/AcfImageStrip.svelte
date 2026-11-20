<script lang="ts">
	import { onMount } from 'svelte'
	import type { StripImage } from '$lib/utilities/imageStrip'

	interface Props {
		block: {
			attributes?: { align?: string | null } | null
			imageStrip?: { maxImages?: number | null; autoScroll?: boolean | null } | null
			/** Attached by the page loader (see resolveImageStripBlocks). */
			resolvedImages?: StripImage[]
		}
	}

	let { block }: Props = $props()

	const images = $derived(block.resolvedImages ?? [])
	const autoScroll = $derived(block.imageStrip?.autoScroll !== false)

	let scroller = $state<HTMLDivElement>()
	let firstSet = $state<HTMLDivElement>()

	// The images are rendered twice in a row. Scrolling is kept within the first
	// copy by jumping back one copy-width whenever it runs past, which makes the
	// strip loop endlessly in both directions without a visible seam.
	onMount(() => {
		const el = scroller
		const set = firstSet
		if (!el || !set || images.length === 0) return

		const loopWidth = () => set.getBoundingClientRect().width
		// Start somewhere different on each visit.
		el.scrollLeft = Math.random() * loopWidth()

		const wrap = () => {
			const w = loopWidth()
			if (w <= 0) return
			if (el.scrollLeft >= w) el.scrollLeft -= w
			else if (el.scrollLeft <= 0) el.scrollLeft += w
		}
		el.addEventListener('scroll', wrap, { passive: true })

		// Slow sideways drift, paused while the visitor is interacting or the strip
		// is off screen, and never started for reduced-motion visitors.
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		let frame = 0
		let paused = false
		let visible = true
		let last = 0
		let carry = 0
		const SPEED = 28 // px per second

		const tick = (now: number) => {
			const dt = last ? Math.min(now - last, 100) : 0
			last = now
			if (!paused && visible) {
				// scrollLeft only takes effect in whole pixels on some browsers.
				carry += (SPEED * dt) / 1000
				const step = Math.floor(carry)
				if (step >= 1) {
					el.scrollLeft += step
					carry -= step
				}
			}
			frame = requestAnimationFrame(tick)
		}

		const pause = () => (paused = true)
		const resume = () => (paused = false)
		let observer: IntersectionObserver | undefined

		if (autoScroll && !reduceMotion) {
			el.addEventListener('pointerenter', pause)
			el.addEventListener('pointerleave', resume)
			el.addEventListener('focusin', pause)
			el.addEventListener('focusout', resume)
			el.addEventListener('touchstart', pause, { passive: true })
			observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
			observer.observe(el)
			frame = requestAnimationFrame(tick)
		}

		return () => {
			cancelAnimationFrame(frame)
			observer?.disconnect()
			el.removeEventListener('scroll', wrap)
			el.removeEventListener('pointerenter', pause)
			el.removeEventListener('pointerleave', resume)
			el.removeEventListener('focusin', pause)
			el.removeEventListener('focusout', resume)
			el.removeEventListener('touchstart', pause)
		}
	})
</script>

{#snippet set(hidden: boolean)}
	{#each images as image, i}
		<a
			href={image.projectUri}
			class="strip-item group relative block h-full shrink-0 overflow-hidden"
			style:aspect-ratio="{image.width} / {image.height}"
			style:background-color={image.dominantColor}
			tabindex={hidden ? -1 : undefined}
			aria-hidden={hidden ? 'true' : undefined}
		>
			<img
				src={image.src}
				srcset={image.src2x ? `${image.src} 1x, ${image.src2x} 2x` : undefined}
				alt={hidden ? '' : image.alt}
				width={image.width}
				height={image.height}
				loading={!hidden && i < 6 ? 'eager' : 'lazy'}
				decoding="async"
				class="h-full w-full max-w-none object-cover"
			/>
			<span
				class="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-black px-2 py-1 text-sm text-white transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0"
			>
				{image.projectTitle}
			</span>
		</a>
	{/each}
{/snippet}

{#if images.length > 0}
	<div
		bind:this={scroller}
		class="image-strip flex h-[38vw] max-h-[320px] min-h-[180px] w-full gap-1 overflow-x-auto overflow-y-hidden"
		role="region"
		aria-label="Images from our work"
	>
		<div bind:this={firstSet} class="flex h-full shrink-0 gap-1 pr-1">
			{@render set(false)}
		</div>
		<div class="flex h-full shrink-0 gap-1 pr-1">
			{@render set(true)}
		</div>
	</div>
{/if}

<style>
	.image-strip {
		scrollbar-width: none;
		overscroll-behavior-x: contain;
	}
	.image-strip::-webkit-scrollbar {
		display: none;
	}
</style>
