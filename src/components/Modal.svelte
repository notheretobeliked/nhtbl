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
    <button transition:scale|global={{ duration: 300 }} class="w-12 h-12 fixed inset-4 border-none bg-transparent text-xl cursor-pointer text-nhtbl-green-base {showButton ?? 'hidden'}" on:click={close}>
      <svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1583_784)">
          <path
            d="M2.94999 44.6399C16.65 31.0399 29.95 17.0399 42.83 2.65995C44.11 1.22995 42 -0.900052 40.71 0.539948C27.83 14.9199 14.53 28.9199 0.829994 42.5199C-0.540006 43.8799 1.57999 45.9999 2.94999 44.6399Z"
            class="fill-nhtbl-green-base"
          />
          <path
            d="M1.77999 3.71003C15.38 17.41 29.38 30.71 43.76 43.59C45.19 44.87 47.32 42.76 45.88 41.47C31.5 28.59 17.5 15.29 3.89999 1.59003C2.53999 0.220034 0.419987 2.34003 1.77999 3.71003Z"
            class="fill-nhtbl-green-base"
          />
        </g>
        <defs>
          <clipPath id="clip0_1583_784">
            <rect width="47.3" height="45.27" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
    <div class="rounded max-h-80vh relative max-w-full w-full">
      <slot></slot>
    </div>
  </div>
  