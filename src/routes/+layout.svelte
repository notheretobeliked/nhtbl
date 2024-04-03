<script lang="ts">
  import "../app.css";
  import type { PageData } from "./$types"
  import { page } from '$app/stores'; // Importing $page store
  export let data: PageData
  let menuItems = data.data.menu.menuItems.nodes
  let currentPage = $page.url.pathname
  
  import Header from "$components/Header.svelte";

  $: {
    menuItems
    currentPage
  }

</script>
<Header {menuItems} {currentPage} />
<slot />
