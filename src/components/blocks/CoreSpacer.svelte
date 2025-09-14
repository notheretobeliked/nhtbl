<script lang="ts">
  import type { EditorBlock } from '$lib/graphql/generated'
  export let block: EditorBlock & { attributes?: any }
  const height:string = block.attributes.height ? block.attributes.height : '5px'
</script>

<div style="height:{height}"></div>
