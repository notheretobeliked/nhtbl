<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  export let block: ExtendedEditorBlock
  const height:string = block.attributes?.height ? block.attributes.height : '5px'
</script>

<div style="height:{height}"></div>
