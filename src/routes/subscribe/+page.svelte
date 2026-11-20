<script lang="ts">
	import { page } from '$app/stores'
	import NewsletterForm from '$components/NewsletterForm.svelte'

	// Set by the root layout when Brevo is configured on the server.
	const newsletterEnabled = $derived(($page.data as any)?.newsletterEnabled === true)
</script>

<div class="page-main bg-nhtbl-purple-base pt-24 pb-7 min-h-[70vh] flex flex-col">
	<h1 class="mt-7">Hear from us</h1>
	<p class="text-lg">
		What we’re making and why: new work, actions, and the occasional longer piece on art and
		activism. A few emails a year, and you can unsubscribe whenever you like.
	</p>
	<div class="mt-4 w-full">
		{#if newsletterEnabled}
			<div class="max-w-xl">
				<NewsletterForm theme="light" id="subscribe-email" />
			</div>
		{:else}
			<p>
				Signups aren’t switched on yet. Email
				<a class="underline" href="mailto:welikeyou@nhtbl.studio">welikeyou@nhtbl.studio</a>
				and we’ll add you.
			</p>
		{/if}
	</div>
</div>
