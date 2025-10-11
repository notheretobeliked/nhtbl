<script lang="ts">
  import type { ServiceNode } from '$lib/types/wp-types'
  // TODO: Migrate to generated AcfServicePush type when ServiceNode type is aligned
  export let block: any
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import Button from '$components/Button.svelte'
  import Image from '$components/atoms/Image.svelte'
  const colour = block.attributes.backgroundColor ?? 'transparent'
</script>

{#each block.servicePush.service.nodes as serviceBlock}
  <div class="relative transition-colors duration-300 px-4 py-8 cursor-pointer">
    <a href={serviceBlock.uri} class="inset-0 flex flex-col md:flex-row gap-4 alignwide">
      <div class="md:w-[41.66666667%]">
        <figure class="aspect-[3/2] overflow-hidden relative">
          <Image
            imageObject={serviceBlock.featuredImage.node}
            imageSize="medium"
            fit="cover"
            extraClasses="w-full h-full absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105 w-full h-full"
          />
        </figure>
      </div>
      <div class="transition-colors duration-300 flex flex-col gap-3 w-full">
        {#each block.children as childBlock}
          <BlockRenderer block={childBlock} forceFull />
        {/each}
        <div class="flex-shrink mt-4">
          <Button font="sans" url={serviceBlock.uri} label="Find out more" />
        </div>
      </div>
    </a>
  </div>
{/each}
