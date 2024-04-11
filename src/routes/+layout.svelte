<script lang="ts">
  import '../app.css'
  import { page } from '$app/stores'
  import type { LayoutAPIResponse } from '$lib/types/wp-types'
  import type { PageData } from './$types'
  import Twitter from '$components/SEO/Twitter.svelte'
  import OpenGraph from '$components/SEO/OpenGraph.svelte'
  import Header from '$components/Header.svelte'
  export let data: PageData
  let { seo, menu } = data
  console.log(seo)
  const menuItems = menu.menuItems.nodes
  const image = seo.opengraphImage
  const metadescription = seo.metaDesc
  const pageTitle = seo.title
  const siteUrl = seo.opengraphUrl
  const siteTitle = seo.opengraphSiteName // Assuming this is used for og:site_name
</script>

{#key $page.url.pathname}
  <OpenGraph {image} {metadescription} {pageTitle} {siteTitle} {siteUrl} />
  <Twitter 
    {image} 
    {metadescription} 
    {pageTitle} 
    {siteUrl} />
{/key}

<Header {menuItems} />
<slot />
