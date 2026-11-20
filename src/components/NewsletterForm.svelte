<script lang="ts">
	import NewsletterNameModal from '$components/NewsletterNameModal.svelte'
	import { env as publicEnv } from '$env/dynamic/public'
	import { getTurnstileToken, loadTurnstile } from '$lib/utilities/turnstile'

	interface Props {
		/** 'dark' sits on black (footer); 'light' sits on a light page background. */
		theme?: 'dark' | 'light'
		/** Unique id for the email input, so two forms can share a page. */
		id?: string
	}

	let { theme = 'dark', id = 'newsletter-email' }: Props = $props()

	let email = $state('')
	let website = $state('') // honeypot
	let status = $state<'idle' | 'sending' | 'done' | 'error'>('idle')
	let message = $state('')

	// After a successful signup: offer to add a name to the address just used.
	let nameStep = $state<{ email: string; nameToken: string; confirm: boolean } | null>(null)

	const dark = $derived(theme === 'dark')

	async function subscribe(event: SubmitEvent) {
		event.preventDefault()
		if (status === 'sending') return
		status = 'sending'
		message = ''
		try {
			// Invisible bot check (only when a site key is configured).
			let turnstileToken = ''
			const siteKey = publicEnv.PUBLIC_TURNSTILE_SITE_KEY
			if (siteKey) {
				try {
					turnstileToken = await getTurnstileToken(siteKey)
				} catch (err) {
					console.error(err)
					status = 'error'
					message =
						'We couldn’t check that you’re not a robot. Please try again, or email us to sign up.'
					return
				}
			}
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email, website, turnstileToken })
			})
			const data = await res.json().catch(() => ({}))
			if (res.ok && data.ok) {
				status = 'done'
				message = data.confirm
					? 'Nearly there – check your inbox to confirm.'
					: 'You’re on the list. Thank you!'
				// No pass comes back when the honeypot swallowed the request.
				if (data.nameToken && data.email) {
					nameStep = { email: data.email, nameToken: data.nameToken, confirm: data.confirm === true }
				}
				email = ''
			} else {
				status = 'error'
				message = data.error ?? 'Something went wrong. Please try again.'
			}
		} catch {
			status = 'error'
			message = 'Something went wrong. Please try again.'
		}
	}
</script>

<form onsubmit={subscribe}>
	<div class="flex flex-col gap-2 sm:flex-row">
		<label for={id} class="sr-only">Email address</label>
		<input
			{id}
			type="email"
			name="email"
			required
			autocomplete="email"
			placeholder="Your email address"
			bind:value={email}
			onfocus={() => {
				// Warm up the bot check while the address is being typed.
				if (publicEnv.PUBLIC_TURNSTILE_SITE_KEY) loadTurnstile().catch(() => {})
			}}
			class="h-12 w-full min-w-0 shrink-0 sm:shrink sm:flex-1 rounded-full border bg-transparent px-5 text-base focus:outline-none {dark
				? 'border-white/60 text-white placeholder:text-white/50 focus:border-nhtbl-green-base'
				: 'border-black text-black placeholder:text-black/50 focus:border-2'}"
		/>
		<!-- Honeypot: hidden from people, tempting to bots. -->
		<input
			type="text"
			name="website"
			tabindex="-1"
			autocomplete="off"
			aria-hidden="true"
			bind:value={website}
			class="hidden"
		/>
		<button
			type="submit"
			disabled={status === 'sending'}
			class="h-12 shrink-0 cursor-pointer rounded-full bg-nhtbl-green-base px-5 text-base text-black transition-[filter] duration-200 hover:brightness-95 disabled:cursor-wait disabled:opacity-60 {dark
				? ''
				: 'border border-black'}"
		>
			{status === 'sending' ? 'Signing up…' : 'Sign up'}
		</button>
	</div>
	<p
		class="mt-2 mb-0 min-h-5 text-sm {dark
			? status === 'error'
				? 'text-nhtbl-purple-base'
				: 'text-nhtbl-green-base'
			: 'text-black'}"
		aria-live="polite"
	>
		{message}
	</p>
</form>

<NewsletterNameModal
	open={nameStep !== null}
	email={nameStep?.email ?? ''}
	nameToken={nameStep?.nameToken ?? ''}
	confirm={nameStep?.confirm ?? false}
	onclose={() => (nameStep = null)}
/>
