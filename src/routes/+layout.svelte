<script lang="ts">
  import "../app.css";
  import type { PageData } from "./$types"
  export let data: PageData
  const menuItems = data.data.menu.menuItems.nodes
  console.log(menuItems)
  import Button from '$components/Button.svelte'
</script>
<header>
  <nav class="fixed z-30 w-full flex px-4 justify-between items-center">
    <a href="/"><img src="/Nhtbl-logo.png" width="89" height="89" alt="A happy face drawn by a child" /></a>
    <ul class="flex flex-row gap-7 justify-end">
      {#each menuItems as menuItem, index}
      <Button label={menuItem.label} url={menuItem.uri} />
      {/each}
    </ul>
  </nav>
  
</header>
<slot />
