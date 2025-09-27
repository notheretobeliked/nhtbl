<script lang="ts">
  import { pushState } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { PortfolioItemNode, ImageSize } from '$lib/types/wp-types.ts';

  export let block: PortfolioItemNode;
  let videos: HTMLVideoElement[] = [];
  let scrollContainer: HTMLDivElement;
  let showLeftArrow = false;
  let showRightArrow = false;

  const openSlideshow = (event): void => {
    event.preventDefault();
    pushState('', { showModal: true }); // Using pushState for shallow routing
  };

  const getSrcSet = (sizes: ImageSize[]): string => {
    return sizes.map(({ sourceUrl, width }) => `${sourceUrl} ${width}w`).join(', ');
  };

  const scrollLeft = () => {
    const visibleElement = getVisibleElement();
    const elementWidth = visibleElement ? visibleElement.offsetWidth + 80 : 0;
    scrollContainer.scrollBy({
      left: -elementWidth,
      behavior: 'smooth'
    });
    setTimeout(updateArrowVisibility, 300); // Ensure arrow visibility updates after scroll animation
  };

  const scrollRight = () => {
    const visibleElement = getVisibleElement();
    const elementWidth = visibleElement ? visibleElement.offsetWidth + 80 : 0;
    scrollContainer.scrollBy({
      left: elementWidth,
      behavior: 'smooth'
    });
    setTimeout(updateArrowVisibility, 300); // Ensure arrow visibility updates after scroll animation
  };

  const getVisibleElement = () => {
    const elements = scrollContainer.querySelectorAll('img, video');
    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      if (rect.left >= 0 && rect.right <= window.innerWidth) {
        return element;
      }
    }
    return null;
  };

  const updateArrowVisibility = () => {
    const scrollLeft = scrollContainer.scrollLeft;
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    showLeftArrow = scrollLeft > 0;
    showRightArrow = scrollLeft < maxScrollLeft;
  };

  onMount(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.play();
          } else {
            entry.target.pause();
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    videos.forEach(video => observer.observe(video));

    // Initial check for arrow visibility with a delay to ensure correct layout calculation
    setTimeout(updateArrowVisibility, 200);

    scrollContainer.addEventListener('scroll', updateArrowVisibility);

    return () => {
      observer.disconnect();
      scrollContainer.removeEventListener('scroll', updateArrowVisibility);
    };
  });
</script>

<h3 class="text-nhtbl-green-base text-center font-display mb-2">{@html block.title}</h3>
{#if block.projectData.imageGallery.nodes.length > 1}
  <div class="fixed top-1/2 left-3 invisible md:visible" class:hidden={!showLeftArrow}>
    <button on:click={scrollLeft}>
      <svg width="25" height="40" class="rotate-180" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.300049 0.400024C8.04005 6.23002 15.7901 12.06 23.5301 17.89C16.3801 25.39 8.91005 32.58 1.15005 39.44C1.67005 39.13 2.19005 38.82 2.71005 38.51"
          class="stroke-nhtbl-green-base fill-none stroke-[3px]"
          stroke-miterlimit="10"
        />
      </svg>
    </button>
  </div>
  <div class="fixed top-1/2 right-3 invisible md:visible" class:hidden={!showRightArrow}>
    <button on:click={scrollRight}>
      <svg width="25" height="40" viewBox="0 0 25 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.300049 0.400024C8.04005 6.23002 15.7901 12.06 23.5301 17.89C16.3801 25.39 8.91005 32.58 1.15005 39.44C1.67005 39.13 2.19005 38.82 2.71005 38.51"
          class="stroke-nhtbl-green-base fill-none stroke-[3px]"
          stroke-miterlimit="10"
        />
      </svg>
    </button>
  </div>
{/if}
<div class="flex flex-row w-full overflow-x-auto h-[60vh] first-letter:md:h-[80vh] gap-3 md:gap-8" bind:this={scrollContainer}>
  {#each block.projectData.imageGallery.nodes || [] as mediaNode}
    {#if mediaNode.mediaType === 'image'}
      <img
        srcset={getSrcSet(mediaNode.mediaDetails.sizes)}
        sizes="(max-width: 600px) 480px, 800px"
        src={mediaNode.mediaDetails.sizes?.find(size => size.name === 'large')?.sourceUrl ?? 'fallbackImageUrl'}
        alt={mediaNode.altText}
        class="h-full w-auto max-w-none"
      />
    {:else if mediaNode.mediaType === 'file' && mediaNode.mimeType === 'video/mp4'}
      <video bind:this={videos[videos.push() - 1]} controls loop muted class="h-full w-auto max-w-none">
        <source src={mediaNode.mediaItemUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    {/if}
  {/each}
</div>
<div class="text-nhtbl-green-base mt-1">{@html block.content}</div>
