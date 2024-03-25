<script lang="ts">
    export let block:Array<any>;
    const { content, fontSize, level } = block.attributes
    console.log(fontSize)
    
  </script>
{#if level === 1}
<h1 class="text-{fontSize} font-display mb-7">{@html content }</h1>
{/if}
{#if level === 2}
<h2 class="text-{fontSize} font-display mb-7">{@html content }</h2>
{/if}
{#if level === 3}
<h3 class="text-{fontSize} font-display">{@html content }</h3>
{/if}