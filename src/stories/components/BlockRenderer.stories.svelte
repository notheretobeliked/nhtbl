<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BlockRenderer from '../../components/BlockRenderer.svelte';

  // Mock blocks for different content types
  const createMockBlocks = () => [
    {
      name: 'core/heading',
      attributes: {
        content: 'Sample Article Title',
        level: 1,
        fontSize: 'xl',
        textColor: 'black'
      },
      clientId: 'heading-1'
    },
    {
      name: 'core/paragraph',
      attributes: {
        content: 'This is a sample paragraph that demonstrates how the BlockRenderer component works with different types of content blocks. It can render various block types in sequence.',
        fontSize: 'base',
        textColor: 'black'
      },
      clientId: 'paragraph-1'
    },
    {
      name: 'core/image',
      attributes: {
        url: 'https://picsum.photos/600/300',
        alt: 'Sample image in block renderer',
        width: 600,
        height: 300,
        align: 'center',
        caption: 'This is an image block within the block renderer'
      },
      clientId: 'image-1'
    },
    {
      name: 'core/paragraph',
      attributes: {
        content: 'Another paragraph following the image. The BlockRenderer can handle multiple blocks of the same type and render them in sequence.',
        fontSize: 'base',
        textColor: 'gray-700'
      },
      clientId: 'paragraph-2'
    },
    {
      name: 'core/button',
      attributes: {
        text: 'Sample Button',
        url: '#',
        fontSize: 'base',
        backgroundColor: 'nhtbl-green-base',
        textColor: 'black'
      },
      clientId: 'button-1'
    }
  ];

  const { Story } = defineMeta({
    title: 'Components/BlockRenderer',
    component: BlockRenderer,
    tags: ['autodocs'],
    argTypes: {
      blocks: {
        control: 'object'
      }
    },
    args: {
      blocks: createMockBlocks()
    }
  });
</script>

<Story name="Default Article Content" />

<Story name="Simple Content" args={{
  blocks: [
    {
      name: 'core/heading',
      attributes: {
        content: 'Simple Page',
        level: 2,
        fontSize: 'lg'
      },
      clientId: 'simple-heading'
    },
    {
      name: 'core/paragraph',
      attributes: {
        content: 'This is a simple page with just a heading and a paragraph.',
        fontSize: 'base'
      },
      clientId: 'simple-paragraph'
    }
  ]
}} />

<Story name="Image Gallery" args={{
  blocks: [
    {
      name: 'core/heading',
      attributes: {
        content: 'Image Gallery',
        level: 2,
        fontSize: 'xl'
      },
      clientId: 'gallery-heading'
    },
    {
      name: 'core/image',
      attributes: {
        url: 'https://picsum.photos/400/300',
        alt: 'Gallery image 1',
        width: 400,
        height: 300,
        align: 'left'
      },
      clientId: 'gallery-image-1'
    },
    {
      name: 'core/image',
      attributes: {
        url: 'https://picsum.photos/400/300',
        alt: 'Gallery image 2',
        width: 400,
        height: 300,
        align: 'right'
      },
      clientId: 'gallery-image-2'
    },
    {
      name: 'core/image',
      attributes: {
        url: 'https://picsum.photos/600/300',
        alt: 'Gallery image 3',
        width: 600,
        height: 300,
        align: 'center'
      },
      clientId: 'gallery-image-3'
    }
  ]
}} />

<Story name="Mixed Content Types" args={{
  blocks: [
    {
      name: 'core/heading',
      attributes: {
        content: 'Mixed Content Article',
        level: 1,
        fontSize: '2xl'
      },
      clientId: 'mixed-h1'
    },
    {
      name: 'core/paragraph',
      attributes: {
        content: 'This article demonstrates various content types working together.',
        fontSize: 'lg'
      },
      clientId: 'mixed-intro'
    },
    {
      name: 'core/heading',
      attributes: {
        content: 'Section One',
        level: 2,
        fontSize: 'xl'
      },
      clientId: 'mixed-h2'
    },
    {
      name: 'core/list',
      attributes: {
        ordered: false
      },
      innerBlocks: [
        {
          name: 'core/list-item',
          attributes: {
            content: 'First list item'
          }
        },
        {
          name: 'core/list-item',
          attributes: {
            content: 'Second list item'
          }
        },
        {
          name: 'core/list-item',
          attributes: {
            content: 'Third list item'
          }
        }
      ],
      clientId: 'mixed-list'
    },
    {
      name: 'core/buttons',
      innerBlocks: [
        {
          name: 'core/button',
          attributes: {
            text: 'Primary Action',
            url: '#',
            backgroundColor: 'black',
            textColor: 'white'
          }
        },
        {
          name: 'core/button',
          attributes: {
            text: 'Secondary Action',
            url: '#',
            backgroundColor: 'transparent',
            borderColor: 'gray-400',
            textColor: 'gray-700'
          }
        }
      ],
      clientId: 'mixed-buttons'
    }
  ]
}} />

<Story name="Long Form Content" args={{
  blocks: [
    {
      name: 'core/heading',
      attributes: {
        content: 'Long Form Article Title',
        level: 1,
        fontSize: '2xl'
      },
      clientId: 'long-title'
    },
    {
      name: 'core/paragraph',
      attributes: {
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        fontSize: 'lg'
      },
      clientId: 'long-p1'
    },
    {
      name: 'core/heading',
      attributes: {
        content: 'First Section',
        level: 2,
        fontSize: 'xl'
      },
      clientId: 'long-h2-1'
    },
    {
      name: 'core/paragraph',
      attributes: {
        content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
        fontSize: 'base'
      },
      clientId: 'long-p2'
    },
    {
      name: 'core/paragraph',
      attributes: {
        content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
        fontSize: 'base'
      },
      clientId: 'long-p3'
    },
    {
      name: 'core/heading',
      attributes: {
        content: 'Second Section',
        level: 2,
        fontSize: 'xl'
      },
      clientId: 'long-h2-2'
    },
    {
      name: 'core/paragraph',
      attributes: {
        content: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.',
        fontSize: 'base'
      },
      clientId: 'long-p4'
    }
  ]
}} />

<Story name="Empty Blocks" args={{
  blocks: []
}} />

<Story name="Unknown Block Types" args={{
  blocks: [
    {
      name: 'core/heading',
      attributes: {
        content: 'Known Block Type',
        level: 2
      },
      clientId: 'known-block'
    },
    {
      name: 'unknown/custom-block',
      attributes: {
        customProperty: 'value'
      },
      clientId: 'unknown-block'
    },
    {
      name: 'core/paragraph',
      attributes: {
        content: 'This paragraph comes after an unknown block type.',
        fontSize: 'base'
      },
      clientId: 'after-unknown'
    }
  ]
}} />