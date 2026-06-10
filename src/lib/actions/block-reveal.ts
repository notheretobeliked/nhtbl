/**
 * Svelte action for scroll-triggered fade-in animation.
 * Adds block-reveal + block-visible classes, observes intersection for below-fold elements.
 */
export function blockReveal(node: HTMLElement, params?: { delay?: string }) {
	if (!params) return

	node.classList.add('block-reveal', 'block-visible')

	if (params.delay) {
		node.style.transitionDelay = params.delay
	}

	if (typeof window === 'undefined') return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

	const rect = node.getBoundingClientRect()
	if (rect.top < window.innerHeight) return

	// Below the fold: start hidden, animate in on scroll
	node.classList.remove('block-visible')

	// Trigger as soon as any part of the block enters (threshold 0), not at 10%
	// of its area — a block taller than the viewport may never reach 10% until it
	// nearly fills the screen, leaving tall sections (e.g. a "show all" portfolio)
	// blank for seconds. rootMargin pre-fires just before it scrolls into view.
	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('block-visible')
				observer.disconnect()
			}
		},
		{ threshold: 0, rootMargin: '0px 0px 15% 0px' }
	)
	observer.observe(node)

	return {
		destroy() {
			observer.disconnect()
		}
	}
}
