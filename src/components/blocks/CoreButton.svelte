<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreButtonAttributes } from '$lib/graphql/generated'
	import Button from '$components/Button.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreButtonAttributes | undefined)

	const getTextClass = (fontSize: string | null) => {
		switch (fontSize) {
			case 'sm':
				return 'text-sm'
			case 'base':
				return 'text-sm md:text-base'
			case 'lg':
				return 'text-base md:text-lg'
			case 'xl':
				return 'text-base md:text-lg lg:text-xl'
			case '2xl':
				return 'text-xl md:text-2xl'
			default:
				return 'text-sm md:text-base'
		}
	}

	const getBackgroundClass = (backgroundColor: string | null) =>
		backgroundColor ? `bg-${backgroundColor}` : 'bg-nhtbl-green-base'
	const getBorderClass = (borderColor: string | null) =>
		borderColor ? `border-${borderColor} border` : 'border-black border'
	const getTextColorClass = (textColor: string | null) =>
		textColor ? `text-${textColor}` : 'text-black'
</script>

<Button
	textClass={getTextClass(attrs?.fontSize ?? null)}
	colourClass={`${getBackgroundClass(attrs?.backgroundColor ?? null)} ${getBorderClass(attrs?.borderColor ?? null)}`}
	textColourClass={getTextColorClass(attrs?.textColor ?? null)}
	url={attrs?.url ?? '/'}
	label={attrs?.text ?? ''}
/>
