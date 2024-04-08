<script>
    import { createEventDispatcher, onMount } from 'svelte';
    const dispatch = createEventDispatcher();
    import { scale } from 'svelte/transition';
  
    const close = () => {
      dispatch('close');
    };

    let showButton = true
    onMount(async () => {
        showButton != showButton;
    })
  </script>
  
  <div class="fixed flex inset-0 p-4 lg:p-12 justify-center items-center z-50 w-full h-full bg-black backdrop-blur-lg bg-opacity-40">
    <button transition:scale|global={{ duration: 300 }} class="w-12 h-12 fixed inset-4 border-none bg-transparent text-xl cursor-pointer text-nhtbl-green-base {showButton ?? 'hidden'}" on:click={close}>&times;</button>
    <div class="rounded max-h-80vh relative max-w-full w-full">
      <slot></slot>
    </div>
  </div>
  