<script lang="ts">
  export let label: string = 'Read more'
  export let url: string = '/'
  export let variant: 'primary' | 'secondary' = 'primary'
</script>

<button class="bg-nhtbl-green-base rounded-full hover:bg-nhtbl-purple-base py-2 px-4 border-black border">
  <a href={url}>
    {label}
  </a>
</button>
