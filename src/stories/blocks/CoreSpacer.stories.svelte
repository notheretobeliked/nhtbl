<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CoreSpacer from '../../components/blocks/CoreSpacer.svelte';

  // Mock block data for spacers
  const createMockBlock = (height = 50) => ({
    attributes: {
      height
    }
  });

  const { Story } = defineMeta({
    title: 'Blocks/CoreSpacer',
    component: CoreSpacer,
    tags: ['autodocs'],
    argTypes: {
      block: {
        control: 'object'
      }
    },
    args: {
      block: createMockBlock(50)
    }
  });
</script>

<Story name="Default (50px)" />

<Story name="Small (20px)" args={{
  block: createMockBlock(20)
}} />

<Story name="Medium (100px)" args={{
  block: createMockBlock(100)
}} />

<Story name="Large (200px)" args={{
  block: createMockBlock(200)
}} />

<Story name="Extra Large (300px)" args={{
  block: createMockBlock(300)
}} />

<Story name="Different Heights Comparison" args={{}} let:args>
  <div class="space-y-0">
    <div class="bg-gray-100 p-2 text-center text-sm">Content Before</div>
    
    <div class="bg-red-100">
      <div class="text-xs text-center py-1">20px Spacer</div>
      <CoreSpacer block={createMockBlock(20)} />
    </div>
    
    <div class="bg-gray-100 p-2 text-center text-sm">Content Between</div>
    
    <div class="bg-blue-100">
      <div class="text-xs text-center py-1">50px Spacer</div>
      <CoreSpacer block={createMockBlock(50)} />
    </div>
    
    <div class="bg-gray-100 p-2 text-center text-sm">Content Between</div>
    
    <div class="bg-green-100">
      <div class="text-xs text-center py-1">100px Spacer</div>
      <CoreSpacer block={createMockBlock(100)} />
    </div>
    
    <div class="bg-gray-100 p-2 text-center text-sm">Content After</div>
  </div>
</Story>

<Story name="In Content Flow" args={{}} let:args>
  <div class="max-w-2xl">
    <h2 class="text-2xl font-bold mb-4">Article with Spacers</h2>
    
    <p class="mb-4">This is the first paragraph of content. Below this will be a small spacer.</p>
    
    <CoreSpacer block={createMockBlock(30)} />
    
    <p class="mb-4">This paragraph comes after a 30px spacer. It demonstrates how spacers work within content flow.</p>
    
    <CoreSpacer block={createMockBlock(80)} />
    
    <p class="mb-4">This paragraph comes after a larger 80px spacer. Notice the increased visual separation.</p>
    
    <CoreSpacer block={createMockBlock(50)} />
    
    <p>This is the final paragraph, preceded by a 50px spacer.</p>
  </div>
</Story>

<Story name="Responsive Spacing" args={{}} let:args>
  <div class="space-y-4">
    <div>
      <h3 class="text-lg font-semibold mb-2">Mobile Spacing (Small)</h3>
      <div class="max-w-sm border">
        <div class="bg-gray-100 p-2 text-center">Content</div>
        <CoreSpacer block={createMockBlock(30)} />
        <div class="bg-gray-100 p-2 text-center">Content</div>
      </div>
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-2">Desktop Spacing (Large)</h3>
      <div class="max-w-4xl border">
        <div class="bg-gray-100 p-4 text-center">Content</div>
        <CoreSpacer block={createMockBlock(80)} />
        <div class="bg-gray-100 p-4 text-center">Content</div>
      </div>
    </div>
  </div>
</Story>

<Story name="Zero Height" args={{
  block: createMockBlock(0)
}} />

<Story name="Very Large Spacer" args={{
  block: createMockBlock(500)
}} />