<script lang="ts">
import { Template } from '@storybook/addon-svelte-csf';

import HeroImageBlock from '$components/blocks/HeroImageBlock.svelte';
export const meta = {
    title: "Button",
    component: HeroImageBlock
  }
</script>

<Template let:args>
  <!--👇 'on:click' allows to forward event to addon-actions  -->
  <HeroImageBlock {...args}  />

</Template>

