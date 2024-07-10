<script lang="ts">
  export let label: string = 'Read more';
  export let url: string = '/';
  export let active: boolean = false
  export let font: 'display' | 'sans' = 'display'
  export let textClass: string = "text-base";
  export let colourClass: string = "bg-nhtbl-green-base"; // Assuming this is a default style
  export let textColourClass: string = "text-black"; // Assuming this is a default style
  if (active) colourClass = "bg-black text-nhtbl-green-base border-nhtbl-green-base"
  
</script>

<a href={url} class="{colourClass} rounded-full transition-all duration-500 hover:bg-black hover:text-nhtbl-green-base hover:border-nhtbl-green-base pt-3 {font === 'display' ? 'pb-2' : 'pb-3'} px-4 border-black border {textClass} {textColourClass} font-{font} cursor-pointer" role="button">
  {label}
</a>