<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CoreImage from '../../components/blocks/CoreImage.svelte';

  // Mock block data for core images
  const createMockBlock = (url, alt = 'Sample image', width = 800, height = 600, align = 'none', caption = null) => ({
    attributes: {
      url,
      alt,
      width,
      height,
      align,
      caption
    }
  });

  const { Story } = defineMeta({
    title: 'Blocks/CoreImage',
    component: CoreImage,
    tags: ['autodocs'],
    argTypes: {
      block: {
        control: 'object'
      }
    },
    args: {
      block: createMockBlock(
        'https://picsum.photos/800/600',
        'Sample image description'
      )
    }
  });
</script>

<Story name="Default" />

<Story name="With Caption" args={{
  block: createMockBlock(
    'https://picsum.photos/800/600',
    'Image with caption',
    800,
    600,
    'none',
    'This is a sample image caption that describes the image content.'
  )
}} />

<Story name="Left Aligned" args={{
  block: createMockBlock(
    'https://picsum.photos/400/300',
    'Left aligned image',
    400,
    300,
    'left'
  )
}} />

<Story name="Center Aligned" args={{
  block: createMockBlock(
    'https://picsum.photos/600/400',
    'Center aligned image',
    600,
    400,
    'center'
  )
}} />

<Story name="Right Aligned" args={{
  block: createMockBlock(
    'https://picsum.photos/400/300',
    'Right aligned image',
    400,
    300,
    'right'
  )
}} />

<Story name="Different Sizes" args={{}} let:args>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold mb-2">Large Image</h3>
      <CoreImage block={createMockBlock(
        'https://picsum.photos/1200/600',
        'Large landscape image',
        1200,
        600
      )} />
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-2">Medium Image</h3>
      <CoreImage block={createMockBlock(
        'https://picsum.photos/800/800',
        'Medium square image',
        800,
        800
      )} />
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-2">Small Image</h3>
      <CoreImage block={createMockBlock(
        'https://picsum.photos/400/600',
        'Small portrait image',
        400,
        600
      )} />
    </div>
  </div>
</Story>

<Story name="All Alignments" args={{}} let:args>
  <div class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-2">None (Default)</h3>
      <CoreImage block={createMockBlock(
        'https://picsum.photos/600/300',
        'Default alignment',
        600,
        300,
        'none'
      )} />
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-2">Left Aligned</h3>
      <CoreImage block={createMockBlock(
        'https://picsum.photos/300/200',
        'Left aligned',
        300,
        200,
        'left'
      )} />
      <p class="mt-2 text-sm text-gray-600">
        This text flows around the left-aligned image. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-2">Center Aligned</h3>
      <CoreImage block={createMockBlock(
        'https://picsum.photos/400/250',
        'Center aligned',
        400,
        250,
        'center'
      )} />
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-2">Right Aligned</h3>
      <CoreImage block={createMockBlock(
        'https://picsum.photos/300/200',
        'Right aligned',
        300,
        200,
        'right'
      )} />
      <p class="mt-2 text-sm text-gray-600">
        This text flows around the right-aligned image. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  </div>
</Story>