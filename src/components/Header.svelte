<script lang="ts">
  import { page } from '$app/stores'
  import type { MenuItem } from '$lib/types/wp-types'
  export let menuItems: MenuItem[]
  import Button from '$components/Button.svelte'
  import { Hamburger } from 'svelte-hamburgers'
  $: currentPagePath = $page.url.pathname
  $: menuItems = menuItems.map(item => ({
    ...item,
    // Update 'active' or any other relevant property based on the current path
    current: currentPagePath === item.uri,
  }))

  let open: boolean = false

  const toggleMenu = () => {
    open = !open
  }
</script>

<header>
  <nav class="fixed z-30 w-full flex px-4 pt-4 justify-between items-center h-12 md:h-24">
    <a href="/" class="z-30"><img src="/Nhtbl-logo.webp" class="z-50 h-12 w-12 md:h-20 md:w-20" width="89" height="89" alt="A happy face drawn by a child" /></a>
    <div class="block md:hidden z-50 hamburger" on:click={toggleMenu}>
      {#if !open}
        <svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.03 10.1801C9.68 10.3801 16.34 10.6201 22.99 10.6301C29.64 10.6401 36.29 10.4201 42.93 10.2301C44.86 10.1801 44.86 7.17006 42.93 7.23006C36.29 7.42006 29.65 7.65006 23 7.63006C16.34 7.62006 9.68999 7.38006 3.03 7.18006C1.1 7.13006 1.11 10.1301 3.03 10.1801Z"
            fill="#010101"
          />
          <path
            d="M3.03 24.1801C9.68 24.3801 16.34 24.6201 22.99 24.6301C29.64 24.6401 36.29 24.4201 42.93 24.2301C44.86 24.1801 44.86 21.1701 42.93 21.2301C36.29 21.4201 29.64 21.6401 22.99 21.6301C16.33 21.6201 9.68 21.3801 3.03 21.1801C1.1 21.1301 1.11 24.1301 3.03 24.1801Z"
            fill="#010101"
          />
          <path
            d="M3.03 38.1801C9.68 38.3801 16.34 38.6201 22.99 38.6301C29.64 38.6401 36.29 38.4201 42.93 38.2301C44.86 38.1801 44.86 35.1701 42.93 35.2301C36.29 35.4201 29.64 35.6401 22.99 35.6301C16.33 35.6201 9.68 35.3801 3.03 35.1801C1.1 35.1301 1.11 38.1301 3.03 38.1801Z"
            fill="#010101"
          />
        </svg>
      {:else}
        <!-- Closed menu SVG -->
        <svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1583_784)">
            <path
              d="M2.94999 44.6399C16.65 31.0399 29.95 17.0399 42.83 2.65995C44.11 1.22995 42 -0.900052 40.71 0.539948C27.83 14.9199 14.53 28.9199 0.829994 42.5199C-0.540006 43.8799 1.57999 45.9999 2.94999 44.6399Z"
              fill="#010101"
            />
            <path
              d="M1.77999 3.71003C15.38 17.41 29.38 30.71 43.76 43.59C45.19 44.87 47.32 42.76 45.88 41.47C31.5 28.59 17.5 15.29 3.89999 1.59003C2.53999 0.220034 0.419987 2.34003 1.77999 3.71003Z"
              fill="#010101"
            />
          </g>
          <defs>
            <clipPath id="clip0_1583_784">
              <rect width="47.3" height="45.27" fill="white" />
            </clipPath>
          </defs>
        </svg>
      {/if}
    </div>
    <ul
      role="navigation"
      aria-label="Main"
      class="fixed w-full items-center md:static md:content-center md:flex-wrap h-screen md:h-24 inset-0 z-10 bg-nhtbl-green-base md:bg-transparent justify-center md:flex flex-row gap-6 md:justify-end {open
        ? 'flex flex-col'
        : 'hidden'}"
    >
      {#each menuItems as menuItem}
        <li>
          <Button active={menuItem.current} label={menuItem.label} url={menuItem.uri} />
        </li>
      {/each}
    </ul>
  </nav>
</header>
