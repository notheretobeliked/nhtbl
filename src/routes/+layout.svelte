<script lang="ts">
	import '../app.css'
	import { page, navigating } from '$app/stores'
	import type { LayoutData } from './$types'
	import type { ImageObject } from '$lib/types/wp-types'
	import Twitter from '$components/SEO/Twitter.svelte'
	import OpenGraph from '$components/SEO/OpenGraph.svelte'
	import Header from '$components/Header.svelte';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let menuItems = $derived(data.menu.menuItems?.nodes)
	let image = $derived((data.seo.opengraphImage ?? null) as ImageObject | null)
	let metadescription = $derived((data.seo.metaDesc ?? '') as string)
	let pageTitle = $derived((data.seo.title ?? '') as string)
	let siteUrl = $derived((data.seo.opengraphUrl ?? '') as string)
	let siteTitle = $derived(((data.seo as any).opengraphSiteName ?? '') as string)

	// Hide the site chrome on previews, and on pages with the "hide navigation"
	// flag set (e.g. the standalone survey).
	let isPreview = $derived($page.url.pathname.startsWith('/preview'))
	let hideNavigation = $derived(
		((data as any).data?.page?.backgroundColour?.hideNavigation as boolean) === true
	)
	let showHeader = $derived(!isPreview && !hideNavigation)
</script>
{#if showHeader}
	<Header {menuItems} {siteTitle} />
{/if}
{#key $page.url.pathname}
	<OpenGraph {image} {metadescription} {pageTitle} {siteTitle} {siteUrl} />
	<Twitter {image} {metadescription} {pageTitle} {siteUrl} />
{/key}


<main id="main-content" class="md:px-0">
	{@render children?.()}
</main>
