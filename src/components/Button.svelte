<script lang="ts">
  export let label: string = 'Read more'
  export let url: string = '/'
  export let active: boolean = false
  export let variant: 'primary' | 'secondary' = 'primary'
</script>

<button class="{active ? 'bg-nhtbl-purple-base' : 'bg-nhtbl-green-base hover:bg-nhtbl-purple-base'} rounded-full hover:bg-nhtbl-purple-base py-2 px-4 border-black border">
  <a href={url}>
    {label}
  </a>
</button>
