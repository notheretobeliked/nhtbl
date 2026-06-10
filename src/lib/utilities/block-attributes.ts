/**
 * Extracts Tailwind classes from WordPress block attributes.
 * Used by BlockRenderer (structural blocks) and prose components (unwrapped blocks).
 */

export interface BlockClasses {
	spacingClasses: string
	bgClasses: string
	textColorClasses: string
	alignClasses: string
	borderRadius: string | undefined
	className: string
	/** Custom (hex/raw) colours from the editor colour picker — applied inline. */
	customBg: string | undefined
	customText: string | undefined
}

/**
 * Extracts a Tailwind spacing value from a WordPress preset string.
 * After server normalization, format is "spacing|50" → 5 (50 / 10).
 * Also handles raw "var:preset|spacing|50" as a fallback.
 */
export function presetToSpacing(value: string): string | null {
	const match = value.match(/(?:var:preset\|)?spacing\|(\d+)/)
	if (match) return String(parseInt(match[1], 10) / 10)
	return null
}

export function extractBlockClasses(attributes: Record<string, unknown> | undefined): BlockClasses {
	const result: BlockClasses = {
		spacingClasses: '',
		bgClasses: '',
		textColorClasses: '',
		alignClasses: '',
		borderRadius: undefined,
		className: '',
		customBg: undefined,
		customText: undefined
	}

	if (!attributes) return result

	// className
	result.className = (attributes.className as string) ?? ''

	// backgroundColor / textColor
	const bgColor = attributes.backgroundColor as string | undefined
	if (bgColor) result.bgClasses = `bg-${bgColor}`

	const textColor = attributes.textColor as string | undefined
	if (textColor) result.textColorClasses = `text-${textColor}`

	// align
	const align = attributes.align as string | undefined
	if (align === 'full') result.alignClasses = 'alignfull'
	else if (align === 'wide') result.alignClasses = 'alignwide'

	// style (spacing + border radius)
	const raw = attributes.style
	if (raw) {
		try {
			const style = typeof raw === 'string' ? JSON.parse(raw) : raw

			// Spacing
			const spacing = style?.spacing
			if (spacing) {
				const classes: string[] = []
				const sides = [
					['top', 'pt'],
					['right', 'pr'],
					['bottom', 'pb'],
					['left', 'pl']
				] as const

				const padding = spacing.padding
				if (padding) {
					for (const [side, prefix] of sides) {
						const val = padding[side]
						if (val) {
							const tw = presetToSpacing(val)
							if (tw) classes.push(`${prefix}-${tw}`)
						}
					}
				}

				const margin = spacing.margin
				if (margin) {
					const marginSides = [
						['top', 'mt'],
						['right', 'mr'],
						['bottom', 'mb'],
						['left', 'ml']
					] as const
					for (const [side, prefix] of marginSides) {
						const val = margin[side]
						if (val) {
							const tw = presetToSpacing(val)
							if (tw) classes.push(`${prefix}-${tw}`)
						}
					}
				}

				result.spacingClasses = classes.join(' ')
			}

			// Custom colours from the editor colour picker (style.color). A preset
			// reference (var:preset|color|slug) becomes a bg-/text- class; a raw
			// value (hex/rgb) is applied inline.
			const color = style?.color
			if (color) {
				const bg = color.background as string | undefined
				if (bg) {
					const preset = bg.match(/var:preset\|color\|(.+)/)
					if (preset) result.bgClasses = `${result.bgClasses} bg-${preset[1]}`.trim()
					else result.customBg = bg
				}
				const txt = color.text as string | undefined
				if (txt) {
					const preset = txt.match(/var:preset\|color\|(.+)/)
					if (preset) result.textColorClasses = `${result.textColorClasses} text-${preset[1]}`.trim()
					else result.customText = txt
				}
			}

			// Border radius
			result.borderRadius = style?.border?.radius ?? undefined
		} catch {
			// ignore
		}
	}

	return result
}
