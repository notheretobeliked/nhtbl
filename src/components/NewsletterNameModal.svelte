<script lang="ts">
	import { tick } from 'svelte'

	interface Props {
		open: boolean
		/** The address that was just signed up, and the pass that lets us name it. */
		email: string
		nameToken: string
		/** True when a confirmation email was sent (double opt-in). */
		confirm: boolean
		onclose: () => void
	}

	let { open, email, nameToken, confirm, onclose }: Props = $props()

	let firstName = $state('')
	let lastName = $state('')
	let status = $state<'idle' | 'sending' | 'saved' | 'error'>('idle')
	let error = $state('')
	let firstInput = $state<HTMLInputElement>()

	// Fresh state each time it opens, with the cursor in the first field.
	$effect(() => {
		if (!open) return
		firstName = ''
		lastName = ''
		status = 'idle'
		error = ''
		tick().then(() => firstInput?.focus())
	})

	async function save(event: SubmitEvent) {
		event.preventDefault()
		if (status === 'sending') return
		if (!firstName.trim() && !lastName.trim()) {
			onclose()
			return
		}
		status = 'sending'
		error = ''
		try {
			const res = await fetch('/api/subscribe/name', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email, nameToken, firstName, lastName })
			})
			const data = await res.json().catch(() => ({}))
			if (res.ok && data.ok) {
				status = 'saved'
			} else {
				status = 'error'
				error = data.error ?? 'We couldn’t save your name. Your signup is safe, though.'
			}
		} catch {
			status = 'error'
			error = 'We couldn’t save your name. Your signup is safe, though.'
		}
	}

	function onkeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') onclose()
	}

	// Rendered at <body>, so no transformed ancestor can offset the fixed overlay.
	function portal(node: HTMLElement) {
		document.body.appendChild(node)
		return { destroy: () => node.remove() }
	}

	const field =
		'h-12 w-full min-w-0 rounded-full border border-black bg-transparent px-5 text-base text-black placeholder:text-black/50 focus:border-2 focus:outline-none'
</script>

<svelte:window {onkeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		use:portal
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-sans"
		role="dialog"
		aria-modal="true"
		aria-labelledby="newsletter-name-title"
		tabindex="-1"
		onclick={(e) => e.target === e.currentTarget && onclose()}
	>
		<div class="relative w-full max-w-lg bg-nhtbl-purple-base p-5 text-black md:p-6">
			<button
				onclick={onclose}
				class="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-black transition-colors hover:bg-black hover:text-nhtbl-green-base"
				aria-label="Close"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			{#if status === 'saved'}
				<h2 id="newsletter-name-title" class="m-0 pr-8 font-display text-xl">
					Thanks{firstName.trim() ? `, ${firstName.trim()}` : ''}!
				</h2>
				<p class="mt-3 mb-0 text-base">
					That’s saved.{confirm ? ' Don’t forget to click the link in our email to confirm.' : ''}
				</p>
				<button
					onclick={onclose}
					class="mt-5 h-12 cursor-pointer rounded-full border border-black bg-nhtbl-green-base px-5 text-base text-black transition-[filter] duration-200 hover:brightness-95"
				>
					Close
				</button>
			{:else}
				<h2 id="newsletter-name-title" class="m-0 pr-8 font-display text-xl">Thanks for signing up!</h2>
				{#if confirm}
					<p class="mt-3 mb-0 text-base">
						Check your inbox and click the link in our email to confirm.
					</p>
				{/if}
				<p class="mt-3 mb-0 text-base">
					If you’d like us to know what to call you, add your name here. It’s optional.
				</p>
				<form class="mt-4" onsubmit={save}>
					<div class="flex flex-col gap-2 sm:flex-row">
						<label class="sr-only" for="newsletter-first-name">First name</label>
						<input
							id="newsletter-first-name"
							bind:this={firstInput}
							bind:value={firstName}
							type="text"
							autocomplete="given-name"
							placeholder="First name"
							maxlength="80"
							class={field}
						/>
						<label class="sr-only" for="newsletter-last-name">Last name</label>
						<input
							id="newsletter-last-name"
							bind:value={lastName}
							type="text"
							autocomplete="family-name"
							placeholder="Last name"
							maxlength="80"
							class={field}
						/>
					</div>
					<p class="mt-2 mb-0 min-h-5 text-sm" aria-live="polite">{error}</p>
					<div class="mt-2 flex flex-wrap gap-2">
						<button
							type="submit"
							disabled={status === 'sending'}
							class="h-12 cursor-pointer rounded-full border border-black bg-nhtbl-green-base px-5 text-base text-black transition-[filter] duration-200 hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
						>
							{status === 'sending' ? 'Saving…' : 'Save my name'}
						</button>
						<button
							type="button"
							onclick={onclose}
							class="h-12 cursor-pointer rounded-full border border-black px-5 text-base text-black transition-colors hover:bg-black hover:text-nhtbl-green-base"
						>
							No thanks
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}
