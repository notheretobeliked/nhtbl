import type { PageLoad } from './$types'

const images = [
	'/breakdown/drought_1500.jpg',
	'/breakdown/climate-chaos.jpg',
	'/breakdown/police2.webp',
	'/breakdown/earthonfire.jpeg',
	'/breakdown/forest-fire-lg.jpg',
	'/breakdown/polarbear.avif',
	'/breakdown/bg.jpg',
	'/breakdown/police.jpeg',
]
export const load: PageLoad = ({ params }) => {
  return {
    images: images
  }
}
