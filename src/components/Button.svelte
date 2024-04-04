<script lang="ts">
  export let label: string = 'Read more';
  export let url: string = '/';
  export let textClass: string = "text-base";
  export let colourClass: string = "bg-nhtbl-green-base"; // Assuming this is a default style
</script>

<a href={url} class="{colourClass} rounded-full hover:bg-nhtbl-purple-base py-2 px-4 border-black border {textClass}" role="button">
  {label}
</a>