<script lang="ts">
import type { ImageObject, ImageSize } from '$lib/types/wp-types.ts'

  export let imageObject: ImageObject

  export let imageSize: 'medium' | 'medium_large' | 'large' | 'full' = 'medium'
  export let fit: "cover" | "contain" | "fill" | "none" = "none"
  export let extraClasses:string = '';

  const findImageSizeData = (property: keyof ImageSize, sizes: ImageSize[], name: string): string => sizes.find(size => size.name === name)?.[property] || ''
  const getSrcSet = (sizes: ImageSize[]): string => {
    return sizes.map(({ sourceUrl, width }) => `${sourceUrl} ${width}w`).join(', ')
  }

  const src = findImageSizeData('sourceUrl', imageObject.mediaDetails.sizes, 'medium_large') // Note: Ensure the property name matches exactly, JavaScript is case-sensitive.
  const width = findImageSizeData('width', imageObject.mediaDetails.sizes, imageSize)
  const height = findImageSizeData('height', imageObject.mediaDetails.sizes, imageSize)
</script>

<img loading="lazy" class="w-full h-full object-{fit} {extraClasses}" {src} alt={imageObject.altText} {width} {height} srcset={getSrcSet(imageObject.mediaDetails.sizes)} sizes="(max-width: 600px) 480px, 800px" />
