<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CoreParagraph from '../../components/blocks/CoreParagraph.svelte';

  // Mock block data for paragraphs
  const createMockBlock = (content, fontSize = 'base', textColor = 'black', align = 'left', fontFamily = null) => ({
    attributes: {
      content,
      fontSize,
      textColor,
      align,
      fontFamily
    }
  });

  const sampleText = 'This is a sample paragraph text that demonstrates how the CoreParagraph component renders content with different styling options. It can contain various formatting and styles.';

  const { Story } = defineMeta({
    title: 'Blocks/CoreParagraph',
    component: CoreParagraph,
    tags: ['autodocs'],
    argTypes: {
      block: {
        control: 'object'
      }
    },
    args: {
      block: createMockBlock(sampleText)
    }
  });
</script>

<Story name="Default" />

<Story name="Large Text" args={{
  block: createMockBlock(sampleText, 'lg', 'black', 'left')
}} />

<Story name="Small Text" args={{
  block: createMockBlock(sampleText, 'sm', 'gray-600', 'left')
}} />

<Story name="Different Alignments" args={{}} let:args>
  <div class="space-y-4">
    <CoreParagraph block={createMockBlock('Left aligned paragraph text.', 'base', 'black', 'left')} />
    <CoreParagraph block={createMockBlock('Center aligned paragraph text.', 'base', 'black', 'center')} />
    <CoreParagraph block={createMockBlock('Right aligned paragraph text.', 'base', 'black', 'right')} />
  </div>
</Story>

<Story name="Font Families" args={{}} let:args>
  <div class="space-y-4">
    <CoreParagraph block={createMockBlock('Sans serif font family paragraph.', 'base', 'black', 'left', 'sans')} />
    <CoreParagraph block={createMockBlock('Display font family paragraph.', 'lg', 'black', 'left', 'display')} />
    <CoreParagraph block={createMockBlock('Default font family paragraph.', 'base', 'black', 'left')} />
  </div>
</Story>

<Story name="Colors" args={{}} let:args>
  <div class="space-y-4">
    <CoreParagraph block={createMockBlock('Black text paragraph.', 'base', 'black')} />
    <CoreParagraph block={createMockBlock('Green text paragraph.', 'base', 'nhtbl-green-base')} />
    <CoreParagraph block={createMockBlock('Gray text paragraph.', 'base', 'gray-600')} />
  </div>
</Story>

<Story name="With HTML Content" args={{
  block: createMockBlock('This paragraph contains <strong>bold text</strong>, <em>italic text</em>, and <a href="#">a link</a>.')
}} />

<Story name="Long Content" args={{
  block: createMockBlock('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
}} />