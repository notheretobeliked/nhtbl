<script>
    import { onMount } from 'svelte';
    import Modal from '$components/Modal.svelte'; // Assume you have a Modal component for the slideshow
  
    export let data;
  
    let showModal = false;
  
    const openSlideshow = () => {
      showModal = true;
    };
  
    const getSrcSet = (sizes) => {
      return sizes.map(({ sourceUrl, width }) => `${sourceUrl} ${width}w`).join(', ');
    };
  </script>
  
  {#if data?.featuredImage?.node?.mediaDetails?.sizes}
    <img src={data.featuredImage.node.mediaDetails.sizes.find(size => size.name === 'medium_large').sourceUrl}
         alt={data.featuredImage.node.altText}
         on:click={openSlideshow}
         style="cursor: pointer;" />
  {/if}
  
  {#if showModal}
    <Modal on:close={() => showModal = false}>
      <div class="flex flex-row w-full overflow-x-auto h-[50vh]">
        {#each data?.imageGallery?.imageGallery?.nodes as { mediaDetails, altText }}
          <div class="h-[50vh]">
            <img srcset={getSrcSet(mediaDetails.sizes)}
                 sizes="(max-width: 600px) 480px, 800px"
                 src={mediaDetails.sizes.find(size => size.name === 'large').sourceUrl}
                 alt={altText} 
                 class="h-full w-auto max-w-none"/>
          </div>
        {/each}
      </div>
      <div class="text-nhtbl-green-base">{@html data.content}</div>
    </Modal>
  {/if}
