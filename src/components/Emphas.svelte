<script lang="ts">
  import { onMount } from 'svelte'
  import { inview } from 'svelte-inview'
  import { animationQueue } from '$lib/utilities/animationQueue'
  import { draw } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  export let version: 'line' | 'bubble' = 'bubble'
  export let content: string = ''
  export let stroke: string = 'black'

  if (stroke === null) stroke = 'black'

  let isInView: boolean = false
  const options = {
    rootMargin: '40px',
    unobserveOnEnter: true,
  }

  function startAnimation(): Promise<void> {
    return new Promise(resolve => {
      isInView = true
      setTimeout(() => {
        resolve()
      }, 1200) // Adjust according to your animation duration
    })
  }

  const handleChange = ({ detail }: { detail: { inView: boolean } }) => {
    if (detail.inView) {
      animationQueue.add(startAnimation)
    }
  }
</script>

{#if version === 'bubble'}
  <span class="relative inline-block">
    {content}
    <div class="absolute -inset-10">

        
      <svg width="412" height="183" viewBox="0 0 412 183" 
      version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        use:inview={options}
        on:inview_change={handleChange}
        data-inview={isInView}
        style="enable-background:new 0 0 410.15 185.09;"
        xml:space="preserve"
        class="w-full h-full"
        preserveAspectRatio="none"
      >
        {#if isInView}
        <path 
        class="stroke-{stroke} fill-none stroke-[4px]"
        transition:draw={{ delay: 0, duration: 2000, easing: quintOut }}
        d="M34.19 39.46C50.97 34.07 64.46 19.46 68.5 2.29997C66.45 -1.79003 60.09 1.78997 58.21 5.95997C49.9 24.32 66.01 47.4 86 49.92C105.99 52.44 125.47 38.24 133.83 19.91C135.28 16.73 136.48 13.16 135.56 9.77997C132.99 0.389972 116.49 3.99997 114.84 13.59C113.19 23.19 121.38 31.85 130.21 35.97C156.69 48.33 192.46 30.07 197.99 1.36997C185.02 -3.73003 172.69 14.71 178.19 27.51C183.69 40.31 198.68 46.1 212.49 47.95C229.57 50.24 249.19 47.49 259.81 33.91C264.02 28.53 266.28 20.51 262.23 15.01C256.95 7.82997 243.97 11.24 240.84 19.58C237.72 27.93 242.69 37.63 250.14 42.51C257.6 47.39 266.88 48.47 275.78 48.75C296.67 49.41 320.96 44.23 330.34 25.55C333.58 19.09 332.79 8.78997 325.68 7.51997C320.17 6.53997 315.81 11.92 312.82 16.65C306.52 26.6 300.8 41.17 309.87 48.68C312.64 50.97 316.24 51.92 319.72 52.81C344.31 59.11 374.56 63.85 391.47 44.92C389.02 36.62 377.83 33.34 370.02 37.07C362.21 40.8 357.75 49.41 356.29 57.94C351.31 86.89 380.85 116.1 409.75 110.79C414.09 102.36 401.66 94.88 392.2 95.36C363.07 96.83 339.21 127.9 345.32 156.43C351.56 156.15 354.62 147.56 351.66 142.06C348.7 136.56 342.23 133.95 336.09 132.79C317.44 129.24 297.19 135.59 283.9 149.16C278.35 154.83 275.79 166.92 283.56 168.53C289.62 157.98 275.28 147.09 263.24 145.34C246.05 142.83 228.08 146.04 212.82 154.32C207.76 157.07 202.74 160.66 200.55 165.99C198.36 171.32 200.28 178.64 205.72 180.52C212.48 176.58 212.64 166.08 207.83 159.9C203.02 153.72 195.07 150.98 187.44 149.24C175.82 146.59 162.87 145.71 152.67 151.89C142.47 158.07 137.49 173.55 145.55 182.34C153.67 177.54 153.95 164.87 148.04 157.51C142.13 150.15 132.25 147.24 122.86 146.36C108.46 145.02 93.71 147.57 80.6 153.69C76.64 155.54 72.57 157.98 70.87 162C69.17 166.02 71.31 171.79 75.66 172.16C87.21 167.03 86.24 148.53 76.51 140.46C66.78 132.39 52.84 132.2 40.27 133.6C35.16 134.17 29.8 135.05 25.83 138.31C21.86 141.57 20.02 147.97 23.28 151.94C28.84 158.69 39.93 151.22 42.82 142.96C50.97 119.6 28.83 91.5 4.21 93.96C-1.47 96.21 -0.310002 105.9 5.34 108.24C10.98 110.59 17.68 106.94 20.84 101.7C23.99 96.46 24.49 90.1 24.9 84C25.86 69.88 26.75 55.25 21.79 41.99C20.35 38.13 18.2 34.23 14.53 32.35C10.86 30.48 5.44 31.7 4.17 35.62C2.68 40.19 7.45 44.47 12.07 45.83C20.82 48.41 30.94 45.45 36.92 38.57" stroke-miterlimit="10"/>
        {/if}
      </svg>
    </div>
  </span>
{/if}

{#if version === 'line'}
  <span class="relative inline-block">
    <strong>{content}</strong>
    <div class="absolute left-0 right-0 -bottom-1">
        
      <svg width="373" height="9" 
      viewBox="0 0 373 9" 
      fill="none" 
      use:inview={options}
      on:inview_change={handleChange}
      class="w-full h-full"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg">
      {#if isInView}

        <path 
        vector-effect="non-scaling-stroke"
        d="M0.5 6C68.1667 7.16667 215.4 8.8 263 6C310.6 3.2 355.5 2.16667 372 2L363.5 1"
        class="stroke-{stroke} fill-none stroke-[4px]"
        transition:draw={{ delay: 0, duration: 1000, easing: quintOut }}

        />
        {/if}
      </svg>
    </div>
  </span>
{/if}
