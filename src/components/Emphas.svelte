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
    <div class="absolute -inset-10" use:inview={options} on:inview_change={handleChange}>
      <svg width="421" height="169" viewBox="-10 -10 441 189" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" preserveAspectRatio="none">
        {#if isInView}
          <path
            vector-effect="non-scaling-stroke"
            class="stroke-{stroke} fill-none stroke-[3px]"
            transition:draw={{ delay: 0, duration: 2000, easing: quintOut }}
            d="M8.66 61.8899C9.76 46.0499 26.9 36.2499 42.6 33.8699C58.29 31.4899 74.87 33.4599 89.62 27.6199C100.83 23.1799 109.85 14.6399 120.08 8.2599C130.31 1.8699 143.41 -2.3501 154.3 2.8199C162.09 6.5199 167.07 14.1899 173.36 20.0899C195.35 40.6899 231.07 37.2199 258.27 24.2399C271.43 17.9599 284.01 9.7099 298.37 7.1899C312.73 4.6699 329.97 10.0199 335.19 23.6399C336.32 26.5799 336.83 29.7399 338.18 32.5799C344.43 45.7499 363.2 44.9799 377.43 41.7999C391.66 38.6299 410.01 36.7299 417.51 49.2299C419.97 53.3299 420.61 58.2799 420.48 63.0599C419.98 82.4599 406.62 100.9 388.35 107.43C369.61 114.12 345.98 109.85 332.01 124.01C328.13 127.94 325.51 132.91 322.22 137.34C303.94 162 266.37 166.19 238.76 152.78C229.66 148.36 221.28 142.34 211.65 139.26C171.46 126.39 132.95 168.03 90.75 167.76C81.63 167.7 70.64 163.71 69.42 154.67C68.76 149.71 71.4 144.88 71.46 139.87C71.61 128.31 58.62 121.13 47.16 119.6C35.7 118.07 23.21 119.23 13.48 112.98C3.91 106.8 -0.439999 94.4599 0.670001 83.1299C1.78 71.7999 7.54 61.3899 14.54 52.4199"
            stroke-miterlimit="10"
          />
        {/if}
      </svg>
    </div>
  </span>
{/if}

{#if version === 'line'}
  <span class="relative inline-block">
    <strong>{content}</strong>
    <div class="absolute left-0 right-0 -bottom-1" use:inview={options} on:inview_change={handleChange}>
      <svg width="373" height="9" viewBox="0 0 373 9" fill="none" class="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {#if isInView}
          <path
            vector-effect="non-scaling-stroke"
            d="M0.5 6C68.1667 7.16667 215.4 8.8 263 6C310.6 3.2 355.5 2.16667 372 2L363.5 1"
            class="stroke-{stroke} fill-none stroke-[3px]"
            transition:draw={{ delay: 0, duration: 1000, easing: quintOut }}
          />
        {/if}
      </svg>
    </div>
  </span>
{/if}
