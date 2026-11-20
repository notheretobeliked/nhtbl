import type { ProcessedImage } from '$lib/utilities/imageExtractor'

/** One image in an acf/image-strip block, trimmed to what the strip renders. */
export interface StripImage {
	src: string
	/** Larger source for high-density screens, when one exists. */
	src2x?: string
	width: number
	height: number
	alt: string
	projectTitle: string
	projectUri: string
	dominantColor?: string
}

function shuffle<T>(items: T[], random: () => number): T[] {
	const out = [...items]
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1))
		;[out[i], out[j]] = [out[j], out[i]]
	}
	return out
}

function toStripImage(image: ProcessedImage): StripImage | null {
	const sizes = image.mediaDetails?.sizes ?? []
	const pick = (name: string) => sizes.find((s) => s.name === name && s.sourceUrl)
	const base = pick('small') ?? pick('medium') ?? pick('thumbnail') ?? sizes.find((s) => s.sourceUrl)
	if (!base) return null
	const width = Number(base.width)
	const height = Number(base.height)
	if (!width || !height) return null
	const larger = pick('medium') ?? pick('medium_large')
	return {
		src: base.sourceUrl,
		src2x: larger && larger.sourceUrl !== base.sourceUrl ? larger.sourceUrl : undefined,
		width,
		height,
		alt: image.altText || image.projectTitle,
		projectTitle: image.projectTitle,
		projectUri: image.projectUri,
		dominantColor: image.dominantColor ?? undefined
	}
}

/**
 * Choose up to `max` images for a strip, spread across projects: one image from
 * each project in turn (projects and their images in random order), so a project
 * with many images can't crowd out the rest.
 */
export function pickStripImages(
	images: ProcessedImage[],
	max: number,
	random: () => number = Math.random
): StripImage[] {
	const byProject = new Map<string, ProcessedImage[]>()
	for (const image of images) {
		const list = byProject.get(image.projectSlug) ?? []
		list.push(image)
		byProject.set(image.projectSlug, list)
	}
	const queues = shuffle([...byProject.values()], random).map((list) => shuffle(list, random))

	const picked: StripImage[] = []
	while (picked.length < max && queues.some((q) => q.length > 0)) {
		for (const queue of queues) {
			if (picked.length >= max) break
			const next = queue.shift()
			if (!next) continue
			const strip = toStripImage(next)
			if (strip) picked.push(strip)
		}
	}
	return picked
}
