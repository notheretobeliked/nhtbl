<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    const close = () => {
      dispatch('close');
    };
  </script>
  
  <div class="fixed flex inset-0 p-4 lg:p-12 justify-center items-center z-50 w-full h-full bg-black">
    <button class="close-button  text-nhtbl-green-base" on:click={close}>&times;</button>
    <div class="rounded max-h-80vh relative max-w-full w-full">
      <slot></slot>
    </div>
  </div>
  
  <style>
  
    .close-button {
      position: fixed;
      top: 10px;
      right: 10px;
      border: none;
      background: none;
      font-size: 24px;
      cursor: pointer;
    }
  </style>