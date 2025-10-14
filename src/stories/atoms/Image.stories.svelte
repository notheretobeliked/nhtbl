<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Image from '../../components/atoms/Image.svelte';

  // Mock image data for stories
  const mockImageObject = {
    altText: 'Sample image for testing',
    colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    dominantColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    mediaDetails: {
      sizes: [
        {
          name: 'thumbnail',
          sourceUrl: 'https://picsum.photos/300/200',
          width: '300',
          height: '200'
        },
        {
          name: 'small', 
          sourceUrl: 'https://picsum.photos/600/400',
          width: '600',
          height: '400'
        },
        {
          name: 'medium',
          sourceUrl: 'https://picsum.photos/900/600', 
          width: '900',
          height: '600'
        },
        {
          name: 'large',
          sourceUrl: 'https://picsum.photos/1600/900',
          width: '1600', 
          height: '900'
        }
      ]
    },
    contentTypeName: 'attachment',
    databaseId: 1,
    id: 'mock-image-1',
    mediaItemId: 1,
    isComment: false,
    isTermNode: false,
    isContentNode: true,
    isFrontPage: false,
    isPostsPage: false,
    slug: 'sample-image',
    uri: '/sample-image'
  };

  const { Story } = defineMeta({
    title: 'Atoms/Image',
    component: Image,
    tags: ['autodocs'],
    argTypes: {
      imageSize: {
        control: 'select',
        options: ['thumbnail', 'small', 'medium', 'medium_large', 'large', 'x_large']
      },
      fit: {
        control: 'select',
        options: ['cover', 'contain', 'fill', 'none']
      },
      aspect: {
        control: 'select', 
        options: ['square', 'video', 'auto']
      },
      lazy: {
        control: 'boolean'
      },
      shadow: {
        control: 'boolean'
      }
    },
    args: {
      imageObject: mockImageObject,
      imageSize: 'medium',
      fit: 'cover',
      lazy: true,
      shadow: false,
      aspect: 'auto'
    }
  });
</script>

<Story name="Default" />

<Story name="Cover Fit" args={{
  fit: 'cover',
  aspect: 'square'
}} />

<Story name="Contain Fit" args={{
  fit: 'contain',
  aspect: 'square'
}} />

<Story name="With Shadow" args={{
  imageSize: 'large',
  fit: 'cover',
  shadow: true,
  aspect: 'video'
}} />

<Story name="Thumbnail Size" args={{
  imageSize: 'thumbnail',
  fit: 'cover'
}} />