<script lang="ts">
  import { page } from '$app/stores';
  import type {MenuItem} from '$lib/types/wp-types'
  export let menuItems:MenuItem[];
  export let currentPage:string | null = '/'
  import Button from '$components/Button.svelte';
  import { Hamburger } from 'svelte-hamburgers';

  let open:boolean = false;
  // Optional: if you need currentPage to be a reactive variable within this component
  $: currentPage = $page.route.id;
  </script>
<header>
    
    <nav class="fixed z-30 w-full flex px-4 justify-between items-center h-24">
      <a href="/"><img src="/Nhtbl-logo.png" class="z-50 h-24 w-24" width="89" height="89" alt="A happy face drawn by a child" /></a>
      <div class="block md:hidden z-50"><Hamburger bind:open /></div>
      <ul class="fixed w-full items-center md:content-center md:flex-wrap h-screen md:h-24 inset-0 z-10 bg-nhtbl-green-base md:bg-transparent justify-center md:flex flex-row gap-7 md:justify-end {open ? 'flex flex-col' : 'hidden' }" >
        {#each menuItems as menuItem}
        <li>
        <Button active="{currentPage === menuItem.uri}" label={menuItem.label} url={menuItem.uri} />
        </li>
        {/each}
      </ul>
    </nav>
  </header> 