/**
 * Per-item reveal with a "wave" stagger, shared across all elements using it.
 *
 * Each element fades/slides in the first time it enters the viewport. Elements
 * that enter together (one IntersectionObserver callback) cascade in DOM order
 * with a short per-item delay; every callback resets the counter, so a single
 * element scrolled to on its own reveals immediately instead of inheriting a
 * runaway index×delay (which would make item #50 in a long list wait seconds).
 */
const STEP_MS = 70
const MAX_STEPS = 10 // cap the cascade length so large waves still finish fast

let observer: IntersectionObserver | null = null
const reveals = new WeakMap<Element, () => void>()

// Items within COL_TOL px of each other horizontally are treated as one column.
const COL_TOL = 40

function ensureObserver() {
	if (observer || typeof window === 'undefined') return
	observer = new IntersectionObserver(
		(entries) => {
			const visible = entries.filter((e) => e.isIntersecting && reveals.has(e.target))
			if (!visible.length) return

			// Cascade row-major (left→right across columns, then down) rather than by
			// raw `top`. Masonry packs into uneven columns, so a top-sort runs down the
			// shortest column and reads as vertical. Cluster items into columns by x,
			// rank each by its row within its column, then reveal by (row, column).
			// Single-column lists and single-row carousels fall out of this correctly.
			const colXs: number[] = []
			const colIndexFor = (left: number) => {
				for (let c = 0; c < colXs.length; c++) if (Math.abs(left - colXs[c]) < COL_TOL) return c
				colXs.push(left)
				return colXs.length - 1
			}

			const slots = visible.map((entry) => ({
				entry,
				col: colIndexFor(Math.round(entry.boundingClientRect.left)),
				top: entry.boundingClientRect.top,
				row: 0
			}))

			// Column index in true left-to-right order.
			const colRank = new Map(
				[...colXs.keys()].sort((a, b) => colXs[a] - colXs[b]).map((orig, i) => [orig, i])
			)
			// Row = rank by top within each column.
			const byCol = new Map<number, typeof slots>()
			for (const s of slots) (byCol.get(s.col) ?? byCol.set(s.col, []).get(s.col)!).push(s)
			for (const arr of byCol.values()) {
				arr.sort((a, b) => a.top - b.top)
				arr.forEach((s, r) => (s.row = r))
			}

			slots.sort((a, b) => a.row - b.row || colRank.get(a.col)! - colRank.get(b.col)!)

			let i = 0
			for (const { entry } of slots) {
				const el = entry.target as HTMLElement
				const step = Math.min(i++, MAX_STEPS)
				el.style.transitionDelay = `${step * STEP_MS}ms`
				reveals.get(el)?.()
				reveals.delete(el)
				observer!.unobserve(el)
			}
		},
		{ threshold: 0, rootMargin: '0px 0px 10% 0px' }
	)
}

export function staggerReveal(node: HTMLElement) {
	if (typeof window === 'undefined') return
	node.classList.add('stagger-reveal')

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add('is-revealed')
		return
	}

	ensureObserver()
	reveals.set(node, () => node.classList.add('is-revealed'))
	observer!.observe(node)

	return {
		destroy() {
			reveals.delete(node)
			observer?.unobserve(node)
		}
	}
}
