<script lang="ts">
	import { onMount, setContext } from 'svelte'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import Image from '$components/atoms/Image.svelte'
	import { draw } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	interface Props {
		block: any
	}

	let { block }: Props = $props()
	const images = block.homePageHero.images.nodes
	const content = block.children

	// The hero animates its own content (scale + scroll), so suppress the per-block
	// reveal on its children — otherwise their observer fights the scroll, hiding/
	// flickering the text as the card moves.
	setContext('reveal-active', true)

	// Configurable card background from the block's background colour (preset
	// slug → hex), defaulting to white. Custom hex isn't exposed for this block.
	const PALETTE: Record<string, string> = {
		black: '#000000',
		white: '#FFFFFF',
		'nhtbl-green-base': '#E0FF00',
		'nhtbl-grey-base': '#D9D9D9',
		'nhtbl-purple-base': '#D59CE5',
		'nhtbl-purple-light': '#E4D5E8'
	}
	const boxBg = PALETTE[block.attributes?.backgroundColor as string] ?? ''

	let y = $state<number>(0)
	let percentage = $state(100)

	// Continuous crossfade position for the inline (non-top) hero: a fractional
	// index 0 → (N-1) that tracks scroll directly. Two adjacent images crossfade
	// by scroll position instead of firing a fixed-duration CSS fade per band —
	// so fast scrolling can't stack half-finished fades on top of each other.
	// Same last→first order as the floored index above.
	let imagePos = $derived(
		(Math.max(0, Math.min(100, percentage)) / 100) * Math.max(0, images.length - 1)
	)

	// Top-of-page scroll-pin animation state.
	let pageHeight = $state(3000)
	let stopHeight = $state(3000)
	let topStart = $state(0)
	let stopped = $state(false)
	let transformString = $state<string>('')

	let rootEl: HTMLDivElement
	let inlineEl = $state<HTMLDivElement>()
	let mounted = $state(false)
	let arrowVisible = $state(false)

	// Whether this hero sits at the very top of the page. When it doesn't, we drop
	// the tall spacer/pin behaviour (which added whitespace below) and instead
	// flip the images from the hero's own scroll-through-viewport progress.
	let isTop = $state(true)
	let useTopBehavior = $derived(mounted && isTop)

	onMount(() => {
		pageHeight = 3000 + window.innerHeight
		stopHeight = 3000 - window.innerHeight
		topStart = 3000 - window.innerHeight
		isTop = rootEl.getBoundingClientRect().top + window.scrollY < 50
		mounted = true
	})

	let rafPending = false

	$effect(() => {
		void y
		if (!mounted) return

		if (isTop) {
			percentage = 100 - (y / pageHeight) * 100
			stopped = y > stopHeight
			arrowVisible = !stopped
			transformString = !stopped
				? `transform: scale(${percentage}%)`
				: `transform: scale(35%); position:absolute; top:${topStart}px`
			return
		}

		// Coalesce a burst of scroll events into one measurement per frame — reading
		// getBoundingClientRect()/offsetHeight on every event (while also writing
		// styles) thrashes layout and is the main source of the jank.
		if (!inlineEl || rafPending) return
		rafPending = true
		requestAnimationFrame(() => {
			rafPending = false
			if (!inlineEl) return
			const vh = window.innerHeight || 1
			const rect = inlineEl.getBoundingClientRect()
			// Tie progress to the sticky PIN travel (the card pinned at top:0 until it
			// releases), not the whole time on screen. The scale + crossfade then run
			// exactly while the hero is pinned, instead of starting before it settles
			// and finishing after it has scrolled away.
			const pinTravel = Math.max(1, inlineEl.offsetHeight - vh)
			const progress = Math.max(0, Math.min(1, -rect.top / pinTravel))
			percentage = 100 - progress * 100
		})
	})
</script>

<svelte:window bind:scrollY={y} />

<div bind:this={rootEl}>
	{#if useTopBehavior}
		<!-- Top of page: scroll-pinned hero — a full-screen card scales down over a
		     3000px scroll, revealing the flipping background images around it. -->
		<div
			class="{stopped ? 'absolute' : 'fixed top-0'} w-full !px-0 h-screen -z-10 top-0"
			style={stopped ? `top:${topStart}px` : ''}
		>
			{#each images as image, index}
				{@const imageThreshold = 100 / images.length}
				{@const imageStart = imageThreshold * index}
				{@const imageEnd = imageThreshold * (index + 1)}
				{@const shouldBeVisible =
					percentage >= imageStart &&
					(percentage < imageEnd || (index === images.length - 1 && percentage >= 100))}
				<div
					class="absolute top-0 left-0 w-full duration-1000 h-full object-cover transition-all {shouldBeVisible
						? 'opacity-100'
						: 'opacity-0'}"
				>
					<Image imageObject={image} lazy={false} imageSize="medium" fit="cover" />
				</div>
			{/each}
		</div>
		<div class="h-[3000px] relative">
			<div style={transformString} class="box fixed flex h-screen w-screen items-center justify-center">
				<div
					class="relative h-screen w-screen my-[5wv] mx-[5wh] flex justify-center items-center p-4 md:p-8 leading-relaxed text-black"
					style:background-color={boxBg}
				>
					<div class="max-w-4xl font-display text-2xl md:text-4xl lg:text-6xl box-container">
						{#each content as block}
							<BlockRenderer {block} />
						{/each}
					</div>
				</div>
			</div>
			<div class="fixed bottom-10 font-display text-base text-center w-full flex flex-row justify-center">
				{#if arrowVisible}
					<svg fill="none" width="49" height="73" viewBox="0 0 49 73" xmlns="http://www.w3.org/2000/svg">
						<path
							vector-effect="non-scaling-stroke"
							transition:draw={{ delay: 1000, duration: 500, easing: quintOut }}
							class:stroke-black={percentage > 90 && percentage <= 100}
							class:stroke-nhtbl-green-base={percentage > 1 && percentage <= 90 && !stopped}
							class="stroke-[3px]"
							d="M32.88 57.21C28.01 62.25 23.14 67.3 18.27 72.34C12.05 67.64 6.09002 62.74 0.400024 57.64C0.660024 57.98 0.920024 58.32 1.17002 58.67"
							stroke-miterlimit="10"
						/>
						<path
							vector-effect="non-scaling-stroke"
							transition:draw={{ delay: 0, duration: 1000, easing: quintOut }}
							class:stroke-black={percentage > 90 && percentage <= 100}
							class:stroke-nhtbl-green-base={percentage > 1 && percentage <= 90 && !stopped}
							class="stroke-[3px]"
							d="M48.6701 0.5C38.0201 0.84 28.1201 9.02 25.7701 19.41C24.8701 23.37 25.0301 27.71 27.0101 31.26C28.9901 34.81 33.0001 37.35 37.0301 36.86C41.0601 36.37 44.5301 32.31 43.7401 28.33C43.0001 24.6 39.1101 22.22 35.3301 21.75C26.1701 20.63 17.7401 28.39 15.1601 37.25C12.5801 46.11 14.5101 55.62 17.1001 64.48C17.7301 66.64 18.4101 68.9 17.9901 71.11"
							stroke-miterlimit="10"
						/>
					</svg>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Not the top of the page: a sticky-pinned scroll region (no fixed-position
		     3000px hack, so no trailing whitespace). As you scroll through it the card
		     scales 100% → 35% and the background images flip, revealing them around
		     the shrinking card; then it releases and the page continues. -->
		<div bind:this={inlineEl} class="relative w-full h-[200vh]">
			<!-- backface-visibility keeps the sticky layer painted when scrolling stops
			     (it does NOT create a containing block, so it won't break sticky). -->
			<div class="sticky top-0 h-screen w-full overflow-hidden" style="backface-visibility:hidden">
				{#each images as image, index}
					<!-- Opacity is a triangular crossfade around the scroll-linked position:
					     only the two images adjacent to `imagePos` are ever partly visible,
					     and they fade by scroll distance — no CSS transition to stack up. -->
					{@const opacity = Math.max(0, 1 - Math.abs(imagePos - index))}
					<div
						class="absolute inset-0 w-full h-full"
						style="opacity:{opacity};transform:translateZ(0);backface-visibility:hidden;will-change:opacity"
					>
						<Image imageObject={image} lazy={false} imageSize="medium" fit="cover" />
					</div>
				{/each}
				<div
					class="absolute inset-0 flex items-center justify-center"
					style="transform: scale({Math.max(0.35, percentage / 100)}); will-change: transform; backface-visibility: hidden"
				>
					<div
						class="relative h-full w-full flex justify-center items-center p-4 md:p-8 leading-relaxed text-black"
						style:background-color={boxBg}
					>
						<div class="max-w-4xl font-display text-2xl md:text-4xl lg:text-6xl box-container">
							{#each content as block}
								<BlockRenderer {block} />
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
