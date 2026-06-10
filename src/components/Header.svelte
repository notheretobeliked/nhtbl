<script lang="ts">
	import { page } from '$app/stores'
	import type { MenuItem } from '$lib/types/wp-types'
	import Breadcrumbs from '$components/Breadcrumbs.svelte'
	import { slide, fade } from 'svelte/transition'
	import { onMount } from 'svelte'

	interface Props {
		menuItems?: MenuItem[]
		siteTitle?: string
	}

	let { menuItems: rawMenuItems = [] }: Props = $props()

	let open = $state(false)
	let scrollY = $state(0)
	let hovering = $state(false)
	// Whether the last scroll movement was downward (past the top of the page).
	let scrolledDown = $state(false)
	let lastY = 0

	const currentPagePath = $derived($page.url.pathname)
	const breadcrumbs = $derived(($page.data as any)?.breadcrumbs || [])
	// At the very top of the page we show the wordmark; once scrolled (and
	// expanded via hover/scroll-up) we show breadcrumbs instead.
	const atTop = $derived(scrollY < 60)

	// Collapse to the logo circle when scrolling down; expand on scroll up, when
	// the pointer is near the top (desktop hover), or while the mobile menu is open.
	const collapsed = $derived(scrolledDown && !hovering && !open)

	// Update position + direction synchronously in the scroll handler (not a
	// $derived/$effect) so `atTop` and `collapsed` change in the same frame.
	function handleScroll() {
		const y = window.scrollY
		if (y < 60) scrolledDown = false
		else if (y > lastY + 4) scrolledDown = true
		else if (y < lastY - 4) scrolledDown = false
		lastY = y
		scrollY = y
	}

	onMount(handleScroll)

	// Expand when the pointer is within the top bar's strip.
	function handleMouseMove(event: MouseEvent) {
		hovering = event.clientY < 72
	}

	const menuItems = $derived(
		(rawMenuItems ?? []).map((item) => ({
			...item,
			// Match the current path exactly OR a nested page under the menu item.
			current:
				currentPagePath === item.uri ||
				(item.uri !== '/' && !!item.uri && currentPagePath.startsWith(item.uri))
		}))
	)

	const toggleMenu = () => {
		open = !open
	}
</script>

<svelte:window onscroll={handleScroll} onmousemove={handleMouseMove} />

<header>
	{#snippet hamburgerButton(extraClass = '')}
		<button
			type="button"
			class="block md:hidden z-50 hamburger bg-transparent border-none cursor-pointer p-0 {extraClass}"
			onclick={toggleMenu}
			aria-label="Toggle menu"
			aria-expanded={open}
		>
			{#if !open}
				<svg width="32" height="30" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M3.03 10.1801C9.68 10.3801 16.34 10.6201 22.99 10.6301C29.64 10.6401 36.29 10.4201 42.93 10.2301C44.86 10.1801 44.86 7.17006 42.93 7.23006C36.29 7.42006 29.65 7.65006 23 7.63006C16.34 7.62006 9.68999 7.38006 3.03 7.18006C1.1 7.13006 1.11 10.1301 3.03 10.1801Z" fill="#010101" />
					<path d="M3.03 24.1801C9.68 24.3801 16.34 24.6201 22.99 24.6301C29.64 24.6401 36.29 24.4201 42.93 24.2301C44.86 24.1801 44.86 21.1701 42.93 21.2301C36.29 21.4201 29.64 21.6401 22.99 21.6301C16.33 21.6201 9.68 21.3801 3.03 21.1801C1.1 21.1301 1.11 24.1301 3.03 24.1801Z" fill="#010101" />
					<path d="M3.03 38.1801C9.68 38.3801 16.34 38.6201 22.99 38.6301C29.64 38.6401 36.29 38.4201 42.93 38.2301C44.86 38.1801 44.86 35.1701 42.93 35.2301C36.29 35.4201 29.64 35.6401 22.99 35.6301C16.33 35.6201 9.68 35.3801 3.03 35.1801C1.1 35.1301 1.11 38.1301 3.03 38.1801Z" fill="#010101" />
				</svg>
			{:else}
				<svg width="32" height="30" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g clip-path="url(#clip0_1583_784)">
						<path d="M2.94999 44.6399C16.65 31.0399 29.95 17.0399 42.83 2.65995C44.11 1.22995 42 -0.900052 40.71 0.539948C27.83 14.9199 14.53 28.9199 0.829994 42.5199C-0.540006 43.8799 1.57999 45.9999 2.94999 44.6399Z" fill="#010101" />
						<path d="M1.77999 3.71003C15.38 17.41 29.38 30.71 43.76 43.59C45.19 44.87 47.32 42.76 45.88 41.47C31.5 28.59 17.5 15.29 3.89999 1.59003C2.53999 0.220034 0.419987 2.34003 1.77999 3.71003Z" fill="#010101" />
					</g>
					<defs>
						<clipPath id="clip0_1583_784"><rect width="47.3" height="45.27" fill="white" /></clipPath>
					</defs>
				</svg>
			{/if}
		</button>
	{/snippet}

	{#snippet navLink(item: { label?: string | null; uri?: string | null; current?: boolean }, onclick?: () => void)}
		<a
			href={item.uri ?? '/'}
			{onclick}
			class="font-sans text-xl md:text-lg border-b-4 {item.current
				? 'border-nhtbl-green-base'
				: 'border-b-transparent hover:border-b-nhtbl-purple-base'}"
		>
			{item.label}
		</a>
	{/snippet}

	<nav
		class="h-12 fixed top-4 left-2 md:left-4 {collapsed
			? 'right-[calc(100%_-_56px)] md:right-[calc(100%_-_64px)]'
			: 'right-2 md:right-4'} border-black shadow-[0_2px_30px_rgba(0,0,0,0.1)] bg-white/60 rounded-full backdrop-blur-md z-30 overflow-hidden transition-[right] duration-500 ease-in-out"
	>
		{#if collapsed}
			<!-- State 2: just the logo, centred in the circle. -->
			<a href="/" aria-label="Home" class="absolute inset-0 z-40 flex items-center justify-center">
				<img src="/Nhtbl-logo.webp" alt="Not here to be liked" class="h-6 w-6 max-w-none object-contain" />
			</a>
		{:else}
			<!-- Expanded: state 1 wordmark (at top) or state 3 breadcrumbs (scrolled) + menu. -->
			<div class="flex h-full w-full items-center justify-between px-1 ml-1">
				{#if atTop}
					<a href="/" class="z-30 block font-display text-base md:text-lg pl-2 whitespace-nowrap">
						Not here to be liked
					</a>
				{:else}
					<Breadcrumbs {breadcrumbs} />
				{/if}

				{@render hamburgerButton('pr-2')}

				<div class="hidden md:flex items-center gap-4">
					<ul role="navigation" aria-label="Main" class="flex flex-row gap-6 items-center list-none m-0 py-0 pl-0 pr-2">
						{#each menuItems as menuItem}
							<li>{@render navLink(menuItem)}</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</nav>

	<!-- Collapsed (mobile): a matching circle around the hamburger. -->
	{#if collapsed}
		<div
			class="md:hidden fixed top-4 right-2 h-12 w-12 z-30 flex items-center justify-center rounded-full border-black shadow-[0_2px_30px_rgba(0,0,0,0.1)] bg-white/60 backdrop-blur-md"
			in:fade={{ delay: 500, duration: 200 }}
			out:fade={{ duration: 150 }}
		>
			{@render hamburgerButton()}
		</div>
	{/if}

	<!-- Mobile menu (kept outside the clipping pill) -->
	{#if open}
		<ul
			role="navigation"
			aria-label="Main"
			class="fixed w-full items-center md:hidden h-screen top-0 left-0 z-30 bg-white/95 backdrop-blur-md justify-center flex-col gap-6 flex list-none m-0 p-0"
			transition:slide={{ duration: 400, axis: 'y' }}
		>
			{#each menuItems as menuItem, i}
				<li class="menu-item" style="animation-delay: {100 + i * 50}ms;">
					{@render navLink(menuItem, () => (open = false))}
				</li>
			{/each}
		</ul>
	{/if}
</header>

<style>
	@keyframes menuItemFadeIn {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.menu-item {
		opacity: 0;
		animation: menuItemFadeIn 300ms ease-out forwards;
	}
</style>
