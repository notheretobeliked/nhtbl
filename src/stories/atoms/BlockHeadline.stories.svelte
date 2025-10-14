<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BlockHeadline from '../../components/atoms/BlockHeadline.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/BlockHeadline',
    component: BlockHeadline,
    tags: ['autodocs'],
    argTypes: {
      level: {
        control: 'select',
        options: [1, 2, 3, 4, 5, 6]
      },
      size: {
        control: 'select',
        options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']
      }
    },
    args: {
      level: 2,
      size: 'lg'
    }
  });
</script>

<Story name="Default" args={{}} let:args>
  <BlockHeadline {...args}>Sample Block Headline</BlockHeadline>
</Story>

<Story name="H1 Large" args={{ level: 1, size: '3xl' }} let:args>
  <BlockHeadline {...args}>Main Page Headline</BlockHeadline>
</Story>

<Story name="H2 Medium" args={{ level: 2, size: 'xl' }} let:args>
  <BlockHeadline {...args}>Section Headline</BlockHeadline>
</Story>

<Story name="H3 Small" args={{ level: 3, size: 'lg' }} let:args>
  <BlockHeadline {...args}>Subsection Headline</BlockHeadline>
</Story>

<Story name="Different Heading Levels" args={{}} let:args>
  <div class="space-y-4">
    <BlockHeadline level={1} size="3xl">H1 - Main Title</BlockHeadline>
    <BlockHeadline level={2} size="2xl">H2 - Section Title</BlockHeadline>
    <BlockHeadline level={3} size="xl">H3 - Subsection Title</BlockHeadline>
    <BlockHeadline level={4} size="lg">H4 - Article Title</BlockHeadline>
    <BlockHeadline level={5} size="base">H5 - Small Heading</BlockHeadline>
    <BlockHeadline level={6} size="sm">H6 - Tiny Heading</BlockHeadline>
  </div>
</Story>

<Story name="Different Sizes" args={{}} let:args>
  <div class="space-y-4">
    <BlockHeadline level={2} size="4xl">Extra Extra Large</BlockHeadline>
    <BlockHeadline level={2} size="3xl">Extra Large</BlockHeadline>
    <BlockHeadline level={2} size="2xl">Double Extra Large</BlockHeadline>
    <BlockHeadline level={2} size="xl">Extra Large</BlockHeadline>
    <BlockHeadline level={2} size="lg">Large</BlockHeadline>
    <BlockHeadline level={2} size="base">Base</BlockHeadline>
    <BlockHeadline level={2} size="sm">Small</BlockHeadline>
    <BlockHeadline level={2} size="xs">Extra Small</BlockHeadline>
  </div>
</Story>

<Story name="Long Headlines" args={{}} let:args>
  <div class="space-y-4">
    <BlockHeadline level={1} size="2xl">
      This is a Very Long Headline That Spans Multiple Lines and Tests How the Component Handles Wrapping
    </BlockHeadline>
    <BlockHeadline level={2} size="lg">
      Medium Length Headline That Also Wraps on Smaller Screens
    </BlockHeadline>
  </div>
</Story>