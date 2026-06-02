<script lang="ts">
	import { onMount } from 'svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		children?: Snippet
		class?: string
		dataSectionBehavior?: string | null
	}

	let { children, class: className = '', dataSectionBehavior = null }: Props = $props()

	let root: HTMLDivElement | undefined = $state()

	// Stable pseudo-random in [0, 1) seeded by index. SSR-safe.
	function pseudoRandom(seed: number): number {
		const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
		return x - Math.floor(x)
	}

	function depthForIndex(i: number): number {
		// 150-450 px range (centred on ~300), deterministic per index.
		return 150 + pseudoRandom(i + 17) * 300
	}

	/**
	 * Find parallax units within the container. A direct child is one unit,
	 * EXCEPT when it wraps a Columns block (`.corecolumns` grid) — then each
	 * column inside becomes its own unit. Wrapping multiple blocks in a
	 * sub-group bundles them as one unit (the sub-group is one child).
	 */
	function findUnits(container: HTMLElement): HTMLElement[] {
		const units: HTMLElement[] = []
		for (const child of Array.from(container.children) as HTMLElement[]) {
			const grid = child.querySelector(':scope .corecolumns') as HTMLElement | null
			if (grid) {
				for (const col of Array.from(grid.children) as HTMLElement[]) units.push(col)
			} else {
				units.push(child)
			}
		}
		return units
	}

	onMount(() => {
		if (!root) return
		if (typeof window === 'undefined') return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		const units = findUnits(root)
		if (units.length === 0) return

		const depths = units.map((_, i) => depthForIndex(i))
		// Disable transitions on parallax units. BlockRenderer wraps children
		// with a transform transition (in-view reveal) that would re-trigger
		// every frame and make the parallax visibly lag.
		for (const u of units) {
			u.style.willChange = 'transform'
			u.style.transition = 'none'
		}

		// Cache each unit's untransformed document-relative top. Reading the
		// rect in the rAF loop would feed the applied transform back in and drift.
		let baselines: { top: number; height: number }[] = []
		const measure = () => {
			for (const u of units) u.style.transform = ''
			const scrollY = window.scrollY
			baselines = units.map((u) => {
				const rect = u.getBoundingClientRect()
				return { top: rect.top + scrollY, height: rect.height }
			})
		}
		measure()

		let rafId = 0
		const intersecting = new Set<HTMLElement>()

		const update = () => {
			rafId = 0
			if (intersecting.size === 0) return
			const vh = window.innerHeight
			const scrollY = window.scrollY
			for (let i = 0; i < units.length; i++) {
				const { top, height } = baselines[i]
				const viewportTop = top - scrollY
				const center = viewportTop + height / 2
				const progress = (center - vh / 2) / vh
				units[i].style.transform = `translate3d(0, ${(progress * depths[i]).toFixed(2)}px, 0)`
			}
			rafId = requestAnimationFrame(update)
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) intersecting.add(e.target as HTMLElement)
					else intersecting.delete(e.target as HTMLElement)
				}
				if (intersecting.size > 0 && !rafId) {
					rafId = requestAnimationFrame(update)
				}
			},
			{ threshold: 0, rootMargin: '200px' }
		)
		for (const u of units) observer.observe(u)

		const onResize = () => measure()
		window.addEventListener('resize', onResize, { passive: true })
		const ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null
		ro?.observe(root)

		return () => {
			observer.disconnect()
			ro?.disconnect()
			window.removeEventListener('resize', onResize)
			if (rafId) cancelAnimationFrame(rafId)
			for (const u of units) {
				u.style.transform = ''
				u.style.willChange = ''
				u.style.transition = ''
			}
		}
	})
</script>

<div bind:this={root} class={className} data-section-behavior={dataSectionBehavior}>
	{@render children?.()}
</div>
