<script lang="ts">
	import type { MenuItem } from '$lib/types/wp-types'
	import NewsletterForm from '$components/NewsletterForm.svelte'

	interface Props {
		menuItems?: MenuItem[]
		/** Show the newsletter form (only when Brevo is configured on the server). */
		newsletterEnabled?: boolean
	}

	let { menuItems = [], newsletterEnabled = false }: Props = $props()

	const EMAIL = 'welikeyou@nhtbl.studio'
	const INSTAGRAM = 'https://www.instagram.com/notheretobeliked/'
	const PRIVACY = '/privacy-policy'
	const year = new Date().getFullYear()
</script>

<footer class="relative z-10 bg-black text-white font-sans">
	<!-- Spacing uses the nhtbl scale (app.css): 5 = 24px, 6 = 36px, 7 = 56px. -->
	<div class="max-w-[1300px] mx-auto px-4 min-[1340px]:px-0 pt-7 pb-5">
		<div class="grid gap-7 md:grid-cols-[1.4fr_1fr_1.6fr] md:gap-6">
			<!-- Who we are -->
			<div>
				<!-- The enamel badge carries the name, so no separate logo or wordmark. -->
				<a href="/" class="-ml-1 block w-fit">
					<img
						src="/nhtbl-badge-360.webp"
						alt="Not here to be liked"
						width="360"
						height="168"
						loading="lazy"
						class="h-auto w-[180px] max-w-full"
					/>
				</a>
				<p class="mt-4 mb-0 max-w-xs text-base text-white/70">
					An activist art and design studio for change in a world in crisis.
				</p>
			</div>

			<!-- Navigation + contact -->
			<div class="flex flex-col gap-5">
				{#if menuItems.length}
					<nav aria-label="Footer">
						<ul class="m-0 flex list-none flex-col gap-1 p-0 text-base">
							{#each menuItems as item}
								<li>
									<a
										href={item.uri ?? '/'}
										class="border-b-2 border-transparent transition-colors hover:border-nhtbl-green-base"
									>
										{item.label}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				{/if}
				<ul class="m-0 flex list-none flex-col gap-1 p-0 text-base">
					<li>
						<a
							href="mailto:{EMAIL}"
							class="border-b-2 border-transparent transition-colors hover:border-nhtbl-green-base"
						>
							{EMAIL}
						</a>
					</li>
					<li>
						<a
							href={INSTAGRAM}
							target="_blank"
							rel="noopener noreferrer"
							class="border-b-2 border-transparent transition-colors hover:border-nhtbl-green-base"
						>
							Instagram
						</a>
					</li>
					<li>
						<a
							href={PRIVACY}
							class="border-b-2 border-transparent transition-colors hover:border-nhtbl-green-base"
						>
							Privacy
						</a>
					</li>
				</ul>
			</div>

			<!-- Newsletter -->
			{#if newsletterEnabled}
				<div>
					<h2 class="m-0 font-display text-lg">Hear from us</h2>
					<p class="mt-4 mb-0 max-w-md text-base text-white/70">
						We occasionally share news via email. Sign up if you’d like to receive updates from us.
					</p>
					<div class="mt-4">
						<NewsletterForm theme="dark" id="footer-email" />
					</div>
				</div>
			{/if}
		</div>
	</div>
</footer>
