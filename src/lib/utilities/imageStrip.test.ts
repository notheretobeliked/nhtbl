import { describe, expect, it } from 'vitest'
import { pickStripImages } from './imageStrip'
import type { ProcessedImage } from './imageExtractor'

const image = (project: string, n: number, sizes = [{ name: 'small', sourceUrl: `/${project}-${n}-s.webp`, width: '599', height: '337' }, { name: 'medium', sourceUrl: `/${project}-${n}-m.webp`, width: '900', height: '506' }]) =>
	({
		mediaDetails: { sizes },
		altText: '',
		projectSlug: project,
		projectTitle: `Project ${project}`,
		projectUri: `/portfolio/${project}`
	}) as unknown as ProcessedImage

// Deterministic "random" so the order is stable in tests.
const fixed = () => 0.42

describe('pickStripImages', () => {
	it('spreads the pick across projects before taking a second image from any', () => {
		const images = [image('a', 1), image('a', 2), image('a', 3), image('b', 1), image('c', 1)]
		const picked = pickStripImages(images, 3, fixed)
		expect(picked).toHaveLength(3)
		expect(new Set(picked.map((p) => p.projectUri)).size).toBe(3)
	})

	it('never returns more than the maximum, and returns everything when there is less', () => {
		const images = [image('a', 1), image('a', 2), image('b', 1)]
		expect(pickStripImages(images, 2, fixed)).toHaveLength(2)
		expect(pickStripImages(images, 10, fixed)).toHaveLength(3)
	})

	it('uses the small size with a larger 2x source, and falls back to the project title for alt', () => {
		const [picked] = pickStripImages([image('a', 1)], 1, fixed)
		expect(picked).toMatchObject({ src: '/a-1-s.webp', src2x: '/a-1-m.webp', width: 599, height: 337, alt: 'Project a' })
	})

	it('skips images with no usable size', () => {
		expect(pickStripImages([image('a', 1, [])], 5, fixed)).toEqual([])
	})
})
