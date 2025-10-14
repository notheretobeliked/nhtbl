<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CoreList from '../../components/blocks/CoreList.svelte';

  // Mock block data for lists
  const createMockBlock = (ordered = false, items = [], start = 1, reversed = false, type = null) => ({
    attributes: {
      ordered,
      start,
      reversed,
      type
    },
    innerBlocks: items.map((item, index) => ({
      name: 'core/list-item',
      attributes: {
        content: item
      },
      clientId: `item-${index}`
    }))
  });

  const sampleItems = [
    'First list item with some content',
    'Second list item with <strong>bold text</strong>',
    'Third list item with <em>italic text</em>',
    'Fourth list item with a <a href="#">link</a>'
  ];

  const { Story } = defineMeta({
    title: 'Blocks/CoreList',
    component: CoreList,
    tags: ['autodocs'],
    argTypes: {
      block: {
        control: 'object'
      }
    },
    args: {
      block: createMockBlock(false, sampleItems)
    }
  });
</script>

<Story name="Unordered List" />

<Story name="Ordered List" args={{
  block: createMockBlock(true, sampleItems)
}} />

<Story name="Ordered List Starting at 5" args={{
  block: createMockBlock(true, sampleItems, 5)
}} />

<Story name="Reversed Ordered List" args={{
  block: createMockBlock(true, sampleItems, 1, true)
}} />

<Story name="Short List" args={{
  block: createMockBlock(false, [
    'Single item',
    'Another item'
  ])
}} />

<Story name="Long List" args={{
  block: createMockBlock(false, [
    'First item in a longer list',
    'Second item with more detailed content',
    'Third item that demonstrates how the list handles multiple items',
    'Fourth item with some additional context',
    'Fifth item to show vertical spacing',
    'Sixth item with even more content to test layout',
    'Seventh item for good measure',
    'Eighth and final item'
  ])
}} />

<Story name="List Types Comparison" args={{}} let:args>
  <div class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-4">Unordered List</h3>
      <CoreList block={createMockBlock(false, [
        'Bullet point one',
        'Bullet point two',
        'Bullet point three'
      ])} />
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-4">Ordered List</h3>
      <CoreList block={createMockBlock(true, [
        'Numbered item one',
        'Numbered item two', 
        'Numbered item three'
      ])} />
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-4">Ordered List (Starting at 10)</h3>
      <CoreList block={createMockBlock(true, [
        'Item ten',
        'Item eleven',
        'Item twelve'
      ], 10)} />
    </div>
  </div>
</Story>

<Story name="Complex Content" args={{
  block: createMockBlock(false, [
    'Item with <strong>bold formatting</strong>',
    'Item with <em>italic text</em> and <strong>bold text</strong>',
    'Item with a <a href="#" class="text-blue-600 underline">clickable link</a>',
    'Item with <code>inline code</code> formatting',
    'Very long item that contains a lot of text to demonstrate how the list component handles longer content that may wrap to multiple lines within a single list item'
  ])
}} />

<Story name="Nested Lists" args={{}} let:args>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold mb-4">Nested Unordered Lists</h3>
      <CoreList block={createMockBlock(false, [
        'Parent item one',
        'Parent item two',
        'Parent item three'
      ])} />
      <div class="ml-6 mt-2">
        <CoreList block={createMockBlock(false, [
          'Nested item one',
          'Nested item two'
        ])} />
      </div>
    </div>
  </div>
</Story>