<script lang="ts">
  // Assuming the import path is correct, uncomment the next line
  // import Heading from '$components/blocks/Heading.svelte';
  import type { EditorBlock } from '$lib/types/wp-types.ts'
  export let block: EditorBlock;

  const { content, fontSize = null } = block.attributes;

  const classNames = (fontSize: string | null): string | null => {
    if (!fontSize) return null;

    switch (fontSize) {
      case "lg":
        return 'font-display text-lg';
      case "xl":
        return "font-display text-xl";
        case "2xl":
        return "font-display text-2xl";
      case "base":
        return "font-sans text-base";
      default:
        return null; // It's good practice to handle unexpected values
    }
  }
</script>

<!-- Use the class directive in Svelte to dynamically set classes -->
<p class={classNames(fontSize)}>{@html content}</p>
