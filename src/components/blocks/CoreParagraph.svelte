<script lang="ts">
    // import Heading from '$components/blocks//Heading.svelte';
    export let block:Array<any>;
    const { content, fontSize } = block.attributes
    console.log(fontSize)
    let classNames: string
    
    
  </script>

<p class="text-{fontSize}">{@html content }</p>
