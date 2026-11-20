<script lang="ts">
	/**
	 * The floating contact widget: a round button, bottom right on every page,
	 * that opens a short conversation. It asks the questions we start every
	 * project with (what are you trying to change, who needs to notice, by when)
	 * and answers each with a finding about what protest achieves. The answers
	 * arrive in our inbox as a brief. See $lib/contact/brief for the script.
	 */
	import { tick } from 'svelte'
	import { fly, scale } from 'svelte/transition'
	import { env as publicEnv } from '$env/dynamic/public'
	import { getTurnstileToken, loadTurnstile } from '$lib/utilities/turnstile'
	import { contactWidget } from '$lib/contact/widget.svelte'
	import {
		BUDGET_OPTIONS,
		briefMailto,
		CONTACT_EMAIL,
		FINDINGS,
		replyToChange,
		WHEN_OPTIONS,
		type Brief,
		type Finding
	} from '$lib/contact/brief'

	type Step = 'change' | 'notice' | 'when' | 'budget' | 'details' | 'sent'

	const blank = (): Brief => ({ change: '', notice: '', when: '', budget: '', more: '', name: '', email: '' })
	let brief = $state<Brief>(blank())
	let step = $state<Step>('change')
	let draft = $state('')
	let website = $state('') // honeypot
	let status = $state<'idle' | 'sending' | 'error'>('idle')
	let error = $state('')
	// Sending from the site failed or isn't set up: offer an email link with the answers in it.
	let fallback = $state(false)
	let ticked = $state(true)
	let nudged = $state(false)
	let log = $state<HTMLElement | null>(null)
	let field = $state<HTMLTextAreaElement | HTMLInputElement | null>(null)

	const whenOption = $derived(WHEN_OPTIONS.find((o) => o.id === brief.when))
	const budgetOption = $derived(BUDGET_OPTIONS.find((o) => o.id === brief.budget))
	const changeReply = $derived<Finding | null>(brief.change ? replyToChange(brief.change) : null)

	const past = (s: Step) => {
		const order: Step[] = ['change', 'notice', 'when', 'budget', 'details', 'sent']
		return order.indexOf(step) > order.indexOf(s)
	}

	async function advance(to: Step) {
		step = to
		draft = ''
		await tick()
		log?.scrollTo({ top: log.scrollHeight, behavior: 'smooth' })
		field?.focus()
	}

	function answerText(event: SubmitEvent) {
		event.preventDefault()
		const value = draft.trim()
		if (!value) return
		if (step === 'change') {
			brief.change = value
			advance('notice')
		} else if (step === 'notice') {
			brief.notice = value
			advance('when')
		}
	}
	// Enter sends a one-line answer; Shift+Enter makes a new line.
	function onKey(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			;(event.currentTarget as HTMLElement).closest('form')?.requestSubmit()
		}
	}

	async function send(event: SubmitEvent) {
		event.preventDefault()
		if (status === 'sending') return
		status = 'sending'
		error = ''
		fallback = false
		try {
			let turnstileToken = ''
			const siteKey = publicEnv.PUBLIC_TURNSTILE_SITE_KEY
			if (siteKey) turnstileToken = await getTurnstileToken(siteKey).catch(() => '')
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ ...brief, website, turnstileToken })
			})
			const data = await res.json().catch(() => ({}))
			if (res.ok && data.ok) {
				status = 'idle'
				advance('sent')
				return
			}
			fallback = data.fallback === true
			error = data.error ?? 'We couldn’t send that.'
		} catch {
			fallback = true
			error = 'We couldn’t send that.'
		}
		status = 'error'
	}

	function restart() {
		brief = blank()
		ticked = true
		nudged = false
		status = 'idle'
		error = ''
		fallback = false
		advance('change')
	}

	// The checkbox that can't be unticked: it springs back and says so.
	function tryUntick() {
		ticked = false
		nudged = true
		setTimeout(() => (ticked = true), 350)
	}

	function toggle() {
		contactWidget.open = !contactWidget.open
	}
	$effect(() => {
		if (!contactWidget.open) return
		// Warm up the bot check while the visitor is answering.
		if (publicEnv.PUBLIC_TURNSTILE_SITE_KEY) loadTurnstile().catch(() => {})
		tick().then(() => {
			log?.scrollTo({ top: log.scrollHeight })
			field?.focus()
		})
	})
	function onWindowKey(event: KeyboardEvent) {
		if (event.key === 'Escape' && contactWidget.open) contactWidget.open = false
	}
</script>

<svelte:window onkeydown={onWindowKey} />

{#snippet us(text: string, finding: Finding | null = null)}
	<div class="max-w-[88%] rounded-2xl rounded-bl-sm bg-nhtbl-grey-base px-3 py-2">
		<p class="m-0 text-base leading-snug">{text}</p>
		{#if finding}
			<a
				href={finding.url}
				target="_blank"
				rel="noopener noreferrer"
				class="mt-1 block text-xs underline underline-offset-2">{finding.source}</a
			>
		{/if}
	</div>
{/snippet}

{#snippet them(text: string)}
	<div class="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-nhtbl-purple-base px-3 py-2">
		<p class="m-0 text-base leading-snug whitespace-pre-line">{text}</p>
	</div>
{/snippet}

{#snippet ask(text: string)}
	<p class="m-0 mt-2 font-display text-lg leading-tight">{text}</p>
{/snippet}

{#snippet chips(options: readonly { id: string; label: string }[], pick: (id: string) => void)}
	<div class="flex flex-wrap gap-2">
		{#each options as o (o.id)}
			<button
				type="button"
				onclick={() => pick(o.id)}
				class="cursor-pointer rounded-full border border-black bg-white px-4 py-2 text-base transition-colors hover:bg-nhtbl-green-base"
				>{o.label}</button
			>
		{/each}
	</div>
{/snippet}

{#if contactWidget.open}
	<div
		role="dialog"
		aria-label="Talk to us"
		class="fixed right-2 bottom-20 left-2 z-40 flex max-h-[calc(100dvh-6.5rem)] flex-col overflow-hidden rounded-3xl border border-black bg-white font-sans text-black shadow-[0_8px_40px_rgba(0,0,0,0.25)] md:right-4 md:left-auto md:w-[400px] md:max-h-[min(680px,calc(100dvh-7rem))]"
		transition:fly={{ y: 24, duration: 250 }}
	>
		<div class="flex items-baseline justify-between gap-4 border-b border-black bg-nhtbl-green-base px-4 py-3">
			<h2 class="m-0 font-display text-lg">Talk to us</h2>
			<a href="mailto:{CONTACT_EMAIL}" class="text-xs underline underline-offset-2">or just email us</a>
		</div>

		<div bind:this={log} class="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
			{@render ask('What are you trying to change?')}
			{#if past('change')}
				{@render them(brief.change)}
				{#if changeReply}{@render us(changeReply.text, changeReply)}{/if}

				{@render ask('Who needs to notice?')}
				{#if past('notice')}
					{@render them(brief.notice)}
					{@render us(FINDINGS.noticed.text, FINDINGS.noticed)}

					{@render ask('By when?')}
					{#if past('when') && whenOption}
						{@render them(whenOption.label)}
						{@render us(whenOption.reply)}

						{@render ask('Is there a budget?')}
						{#if past('budget') && budgetOption}
							{@render them(budgetOption.label)}
							{@render us(budgetOption.reply)}
							{#if budgetOption.paying}
								<label class="flex max-w-[88%] cursor-pointer items-start gap-2 rounded-2xl rounded-bl-sm bg-nhtbl-grey-base px-3 py-2 text-sm leading-snug">
									<input
										type="checkbox"
										checked={ticked}
										onclick={(e) => {
											e.preventDefault()
											tryUntick()
										}}
										class="mt-0.5 size-4 shrink-0 accent-black"
									/>
									<span
										>Your project helps keep our work with grassroots campaigns going.
										{#if nudged}<span class="block">(You can’t untick this.)</span>{/if}</span
									>
								</label>
							{/if}

							{#if step === 'sent'}
								{@render us('Sent. Thank you. We’ll write back to ' + brief.email + '.')}
								<button type="button" onclick={restart} class="mt-1 w-fit cursor-pointer text-xs underline underline-offset-2">Start again</button>
							{:else}
								{@render ask('Last thing: who are you?')}
							{/if}
						{/if}
					{/if}
				{/if}
			{/if}
		</div>

		<!-- The answer area for the current step. -->
		{#if step === 'change' || step === 'notice'}
			<form onsubmit={answerText} class="flex items-end gap-2 border-t border-black px-3 py-3">
				<textarea
					bind:this={field}
					bind:value={draft}
					onkeydown={onKey}
					rows="2"
					maxlength="2000"
					aria-label={step === 'change' ? 'What are you trying to change?' : 'Who needs to notice?'}
					placeholder={step === 'change' ? 'A law, a brand, a street, a mind…' : 'A minister, a neighbourhood, a board…'}
					class="min-h-12 flex-1 resize-none rounded-2xl border border-black px-3 py-2 text-base placeholder:text-black/40 focus:outline-2 focus:outline-offset-1 focus:outline-black"
				></textarea>
				<button
					class="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black bg-nhtbl-green-base transition-colors hover:bg-black hover:text-nhtbl-green-base disabled:cursor-default disabled:opacity-40 disabled:hover:bg-nhtbl-green-base disabled:hover:text-black"
					disabled={!draft.trim()}
					aria-label="Next"
				>
					<svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
				</button>
			</form>
		{:else if step === 'when'}
			<div class="border-t border-black px-3 py-3">
				{@render chips(WHEN_OPTIONS, (id) => {
					brief.when = id as Brief['when']
					advance('budget')
				})}
			</div>
		{:else if step === 'budget'}
			<div class="border-t border-black px-3 py-3">
				{@render chips(BUDGET_OPTIONS, (id) => {
					brief.budget = id as Brief['budget']
					advance('details')
				})}
			</div>
		{:else if step === 'details'}
			<form onsubmit={send} class="flex flex-col gap-2 border-t border-black px-3 py-3">
				<input bind:this={field} bind:value={brief.name} name="name" autocomplete="name" maxlength="120" placeholder="Your name" aria-label="Your name" class="h-12 rounded-full border border-black px-4 text-base placeholder:text-black/40 focus:outline-2 focus:outline-offset-1 focus:outline-black" />
				<input bind:value={brief.email} type="email" name="email" autocomplete="email" required maxlength="254" placeholder="Your email address" aria-label="Your email address" class="h-12 rounded-full border border-black px-4 text-base placeholder:text-black/40 focus:outline-2 focus:outline-offset-1 focus:outline-black" />
				<textarea bind:value={brief.more} rows="2" maxlength="4000" placeholder="Anything else we should know? (optional)" aria-label="Anything else we should know?" class="resize-none rounded-2xl border border-black px-3 py-2 text-base placeholder:text-black/40 focus:outline-2 focus:outline-offset-1 focus:outline-black"></textarea>
				<!-- Honeypot: hidden from people, tempting to bots. -->
				<input bind:value={website} name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 opacity-0" />
				<button
					class="h-12 cursor-pointer rounded-full border border-black bg-nhtbl-green-base px-5 text-base transition-colors hover:bg-black hover:text-nhtbl-green-base disabled:cursor-default disabled:opacity-60"
					disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send'}</button
				>
				{#if status === 'error'}
					<p class="m-0 text-sm" role="alert">
						{error}
						{#if fallback}
							<a href={briefMailto(brief)} class="underline underline-offset-2">Send it from your own email instead</a>: your answers are already in the message.
						{:else}
							Check the address and try again.
						{/if}
					</p>
				{/if}
			</form>
		{/if}
	</div>
{/if}

<!-- The round button. Sits above the page in every state; turns into a close button while open. -->
<button
	type="button"
	onclick={toggle}
	aria-label={contactWidget.open ? 'Close' : 'Talk to us'}
	aria-expanded={contactWidget.open}
	class="fixed right-2 bottom-4 z-40 flex size-14 cursor-pointer items-center justify-center rounded-full border border-black bg-nhtbl-green-base text-black shadow-[0_2px_30px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-105 md:right-4"
>
	{#key contactWidget.open}
		<span in:scale={{ duration: 180, start: 0.6 }} class="flex">
			{#if contactWidget.open}
				<svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>
			{:else}
				<!-- Speech bubble -->
				<svg viewBox="0 0 24 24" class="size-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 17.5h-8.5L7 21v-3.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5z" /><path d="M7.5 10h9" /><path d="M7.5 13.5h6" /></svg>
			{/if}
		</span>
	{/key}
</button>
