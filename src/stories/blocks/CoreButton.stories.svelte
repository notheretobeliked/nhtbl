<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CoreButton from '../../components/blocks/CoreButton.svelte';

  // Mock block data for core buttons
  const createMockBlock = (text, url = '#', fontSize = 'base', backgroundColor = null, borderColor = null, textColor = null) => ({
    attributes: {
      text,
      url,
      fontSize,
      backgroundColor,
      borderColor,
      textColor
    }
  });

  const { Story } = defineMeta({
    title: 'Blocks/CoreButton',
    component: CoreButton,
    tags: ['autodocs'],
    argTypes: {
      block: {
        control: 'object'
      }
    },
    args: {
      block: createMockBlock('Button Text')
    }
  });
</script>

<Story name="Default" />

<Story name="Primary Button" args={{
  block: createMockBlock('Primary Button', '#', 'lg', 'black', 'black', 'white')
}} />

<Story name="Secondary Button" args={{
  block: createMockBlock('Secondary Button', '#', 'base', 'transparent', 'gray-400', 'gray-700')
}} />

<Story name="Green Button" args={{
  block: createMockBlock('Green Button', '#', 'base', 'nhtbl-green-base', 'black', 'black')
}} />

<Story name="Different Sizes" args={{}} let:args>
  <div class="space-y-4">
    <CoreButton block={createMockBlock('Small Button', '#', 'sm')} />
    <CoreButton block={createMockBlock('Base Button', '#', 'base')} />
    <CoreButton block={createMockBlock('Large Button', '#', 'lg')} />
    <CoreButton block={createMockBlock('Extra Large Button', '#', 'xl')} />
  </div>
</Story>

<Story name="Color Variants" args={{}} let:args>
  <div class="space-y-4">
    <CoreButton block={createMockBlock('Default', '#')} />
    <CoreButton block={createMockBlock('Black', '#', 'base', 'black', 'black', 'white')} />
    <CoreButton block={createMockBlock('Green', '#', 'base', 'nhtbl-green-base', 'black', 'black')} />
    <CoreButton block={createMockBlock('Transparent', '#', 'base', 'transparent', 'gray-400', 'gray-700')} />
    <CoreButton block={createMockBlock('Red', '#', 'base', 'red-500', 'red-600', 'white')} />
  </div>
</Story>

<Story name="With Links" args={{
  block: createMockBlock('Click Me', 'https://example.com', 'lg', 'blue-500', 'blue-600', 'white')
}} />