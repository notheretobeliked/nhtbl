<script lang="ts">
    export let block:EditorBlock
    import BlockRenderer from '$components/BlockRenderer.svelte';
    import Button from '$components/Button.svelte'
    const url = block.servicePush.service.nodes[0].uri
    const altText= block.servicePush.service.nodes[0].featuredImage.node.altText
    const findImageSize = (sizes, name) => sizes.find(size => size.name === name)?.sourceUrl || '';
    const imgSrc = findImageSize(block.servicePush.service.nodes[0].featuredImage.node.mediaDetails.sizes, 'medium')
</script>

<div class="grid grid-cols-2 gap-7">
    <div class="h-full flex flex-col justify-between">
        <div>
          {#each block.children as block, index}
            <BlockRenderer block={block} />
          {/each}
        </div>
        <Button label="Explore" url={url} />
    </div>
    <div class="aspect-square">
        <img src="{imgSrc}" alt="{altText}" class="w-full h-full object-cover" />
    </div>
</div>