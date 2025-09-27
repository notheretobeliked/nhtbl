<script lang="ts">
  interface Props {
    label?: string;
    url?: string;
    active?: boolean;
    font?: 'display' | 'sans';
    textClass?: string;
    colourClass?: string;
    textColourClass?: string;
  }

  let {
    label = 'Read more',
    url = '/',
    active = false,
    font = 'display',
    textClass = "text-base",
    colourClass = "bg-nhtbl-green-base border-black border",
    textColourClass = "text-black"
  }: Props = $props();

  const finalColourClass = $derived(active ? "bg-black text-nhtbl-green-base border-nhtbl-green-base" : colourClass);
</script>

<a href={url} class="{colourClass} rounded-full transition-all duration-500 hover:bg-black hover:text-nhtbl-green-base hover:border-nhtbl-green-base pt-3 {font === 'display' ? 'pb-2' : 'pb-3'} px-4 {textClass} {textColourClass} font-{font} cursor-pointer" role="button">
  {label}
</a>