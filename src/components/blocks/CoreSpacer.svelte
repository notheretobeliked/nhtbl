<script lang="ts">
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'
  
  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()
  const height:string = block.attributes?.height ? block.attributes.height : '5px'
</script>

<div style="height:{height}"></div>
