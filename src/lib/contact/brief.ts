/**
 * The contact widget's script: the questions it asks, what it says back, and
 * how the answers become the message we receive.
 *
 * The replies quote research on what protest achieves. Each figure was checked
 * against its source in November 2026; keep the wording as careful as it is
 * here (see the notes on each finding) if you edit it.
 */

export interface Finding {
	text: string
	source: string
	url: string
}

export const FINDINGS = {
	// Amenta et al. 2010, table 1: 45 articles on 54 movements; all but 4 found
	// at least one positive relationship with a policy outcome.
	movements: {
		text: 'Good. Of 54 movements studied by sociologists in the 2000s, 50 were found to have influenced policy.',
		source: 'Amenta et al., Annual Review of Sociology, 2010',
		url: 'https://doi.org/10.1146/annurev-soc-070308-120029'
	},
	// Brehm & Gruhl 2024: +1.2 percentage points concerned in the 14 days after
	// a protest (17 protests, Germany, 2016–2020); no evidence of backlash.
	concern: {
		text: 'After a climate protest, more people say they’re worried about the climate. A German study of 17 protests found no sign of a backlash, including after civil disobedience.',
		source: 'Brehm and Gruhl, Nature Communications, 2024',
		url: 'https://doi.org/10.1038/s41467-024-46477-4'
	},
	// Ostarek et al. 2024: YouGov panel (n = 1,415) around the M25 protests of
	// November 2022. No percentage quoted: published summaries disagree on it.
	flank: {
		text: 'When Just Stop Oil blocked the M25, people who’d noticed them became more supportive of Friends of the Earth. Movements make room for organisations like yours.',
		source: 'Ostarek et al., Nature Sustainability, 2024',
		url: 'https://doi.org/10.1038/s41893-024-01444-1'
	},
	// YouGov, 5 June 2019: 17% in mid-April, a record 27% by early June.
	noticed: {
		text: 'People do notice. In the weeks after Extinction Rebellion’s April 2019 protests, the share of Britons naming the environment a top-three issue rose from 17% to a record 27%.',
		source: 'YouGov, June 2019',
		url: 'https://yougov.com/en-gb/articles/23691-concern-environment-record-highs'
	}
} satisfies Record<string, Finding>

const CAMPAIGN = /\b(campaign|protest|strike|blockade|occup|direct action|civil disobedience|march|demo|movement|organis(e|ing)|organiz(e|ing)|activis)/i
const INSTITUTION = /\b(museum|gallery|galleries|universit|college|school|institution|organisation|organization|charity|ngo|foundation|trust|brand|company|business|audience|visitors|collection|festival|theatre|library|council|publisher|magazine)/i

const CLIMATE = /\b(climate|fossil|oil|gas|coal|carbon|emission|net zero|environment|nature|ecolog|extinction|pollut|warming)/i

/**
 * What the widget says after "What are you trying to change?". The climate
 * finding only answers a climate campaign; any other campaign gets the general
 * one, so a rent strike isn't told about climate polling.
 */
export function replyToChange(answer: string): Finding {
	if (CAMPAIGN.test(answer)) return CLIMATE.test(answer) ? FINDINGS.concern : FINDINGS.movements
	if (INSTITUTION.test(answer)) return FINDINGS.flank
	return CLIMATE.test(answer) ? FINDINGS.concern : FINDINGS.movements
}

export const WHEN_OPTIONS = [
	{ id: 'yesterday', label: 'Yesterday', reply: 'Understood. Most things worth doing are late.' },
	{ id: 'month', label: 'This month', reply: 'Soon, then. We’ll tell you quickly whether we can.' },
	{ id: 'months', label: 'In the next few months', reply: 'Good. That’s time to do it properly.' },
	{ id: 'open', label: 'No deadline', reply: 'Noted. We can help you set one.' }
] as const

export const BUDGET_OPTIONS = [
	{ id: 'yes', label: 'Yes', reply: 'Thank you for saying so.', paying: true },
	{ id: 'some', label: 'A little', reply: 'That’s a start.', paying: true },
	{ id: 'none', label: 'No, we’re volunteers', reply: 'Good. So are most of the people we work with.', paying: false }
] as const

export type WhenId = (typeof WHEN_OPTIONS)[number]['id']
export type BudgetId = (typeof BUDGET_OPTIONS)[number]['id']

export interface Brief {
	change: string
	notice: string
	when: WhenId | ''
	budget: BudgetId | ''
	more: string
	name: string
	email: string
}

const labelOf = (options: readonly { id: string; label: string }[], id: string) =>
	options.find((o) => o.id === id)?.label ?? '–'

/** The answers as the plain-text message we receive. */
export function briefAsText(b: Brief): string {
	return [
		`From: ${b.name || '(no name)'} <${b.email}>`,
		'',
		'What are you trying to change?',
		b.change || '–',
		'',
		'Who needs to notice?',
		b.notice || '–',
		'',
		`By when? ${labelOf(WHEN_OPTIONS, b.when)}`,
		`Is there a budget? ${labelOf(BUDGET_OPTIONS, b.budget)}`,
		...(b.more.trim() ? ['', 'Anything else:', b.more.trim()] : [])
	].join('\n')
}

/** A short subject line from the first answer. */
export function briefSubject(b: Brief): string {
	const first = b.change.trim().replace(/\s+/g, ' ')
	const short = first.length > 60 ? `${first.slice(0, 57).trimEnd()}…` : first
	return `Via the website: ${short || 'new enquiry'}`
}

export const CONTACT_EMAIL = 'welikeyou@nhtbl.studio'

/** A mailto: link carrying the brief, for when sending from the site isn't available. */
export function briefMailto(b: Brief): string {
	return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(briefSubject(b))}&body=${encodeURIComponent(briefAsText(b))}`
}
