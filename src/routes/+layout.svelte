<script lang="ts">
  import "../app.css";
  import { page } from '$app/stores';
  import type { PageData } from "./$types"
  export let data: PageData
  let {editorBlocks, seo, menu, backgroundColour, uri } = data

  
  const menuItems = menu.menuItems.nodes

  import Header from "$components/Header.svelte";

  
  $: {
    menuItems
    uri
    
  }

</script>

{#key $page.url.pathname}
  <Header {menuItems} />
{/key}
<slot />
