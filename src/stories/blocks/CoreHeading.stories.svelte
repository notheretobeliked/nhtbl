<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CoreHeading from '../../components/blocks/CoreHeading.svelte';

  // Mock block data for different heading levels
  const createMockBlock = (level, content, fontSize = 'base', textColor = 'black', textAlign = 'left') => ({
    attributes: {
      content,
      fontSize,
      textColor,
      textAlign,
      level
    }
  });

  const { Story } = defineMeta({
    title: 'Blocks/CoreHeading',
    component: CoreHeading,
    tags: ['autodocs'],
    argTypes: {
      block: {
        control: 'object'
      }
    },
    args: {
      block: createMockBlock(2, 'Sample Heading')
    }
  });
</script>

<Story name="H1" args={{
  block: createMockBlock(1, 'Main Page Title', 'xl', 'black', 'left')
}} />

<Story name="H2" args={{
  block: createMockBlock(2, 'Section Heading', 'lg', 'black', 'left')
}} />

<Story name="H3" args={{
  block: createMockBlock(3, 'Subsection Heading', 'base', 'black', 'left')
}} />

<Story name="Different Alignments" args={{}} let:args>
  <div class="space-y-4">
    <CoreHeading block={createMockBlock(2, 'Left Aligned Heading', 'lg', 'black', 'left')} />
    <CoreHeading block={createMockBlock(2, 'Center Aligned Heading', 'lg', 'black', 'center')} />
    <CoreHeading block={createMockBlock(2, 'Right Aligned Heading', 'lg', 'black', 'right')} />
  </div>
</Story>

<Story name="Different Colors" args={{}} let:args>
  <div class="space-y-4">
    <CoreHeading block={createMockBlock(2, 'Black Heading', 'lg', 'black')} />
    <CoreHeading block={createMockBlock(2, 'Green Heading', 'lg', 'nhtbl-green-base')} />
    <CoreHeading block={createMockBlock(2, 'Gray Heading', 'lg', 'gray-600')} />
  </div>
</Story>

<Story name="Font Sizes" args={{}} let:args>
  <div class="space-y-4">
    <CoreHeading block={createMockBlock(1, 'Extra Large Heading', '2xl')} />
    <CoreHeading block={createMockBlock(2, 'Large Heading', 'xl')} />
    <CoreHeading block={createMockBlock(3, 'Medium Heading', 'lg')} />
    <CoreHeading block={createMockBlock(3, 'Base Heading', 'base')} />
  </div>
</Story>

<Story name="With Emphasis" args={{
  block: createMockBlock(2, 'Heading with <strong>emphasized text</strong>', 'lg', 'black', 'center')
}} />