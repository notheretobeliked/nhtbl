<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Carousel from '../../components/Carousel.svelte';

  // Mock image data for carousel
  const mockImages = [
    {
      altText: 'First slide image',
      mediaDetails: {
        sizes: [
          {
            name: 'large',
            sourceUrl: 'https://picsum.photos/800/400',
            width: '800',
            height: '400'
          }
        ]
      }
    },
    {
      altText: 'Second slide image',
      mediaDetails: {
        sizes: [
          {
            name: 'large',
            sourceUrl: 'https://picsum.photos/800/400',
            width: '800',
            height: '400'
          }
        ]
      }
    },
    {
      altText: 'Third slide image',
      mediaDetails: {
        sizes: [
          {
            name: 'large',
            sourceUrl: 'https://picsum.photos/800/400',
            width: '800',
            height: '400'
          }
        ]
      }
    }
  ];

  const { Story } = defineMeta({
    title: 'Components/Carousel',
    component: Carousel,
    tags: ['autodocs'],
    argTypes: {
      autoplay: {
        control: 'boolean'
      }
    },
    args: {
      images: mockImages,
      autoplay: false
    }
  });
</script>

<Story name="Default" />

<Story name="Autoplay" args={{ autoplay: true }} />

<Story name="Single Image" args={{
  images: [mockImages[0]],
  autoplay: false
}} />

<Story name="Many Images" args={{
  images: [
    ...mockImages,
    {
      altText: 'Fourth slide image',
      mediaDetails: {
        sizes: [
          {
            name: 'large',
            sourceUrl: 'https://picsum.photos/800/400',
            width: '800',
            height: '400'
          }
        ]
      }
    },
    {
      altText: 'Fifth slide image',
      mediaDetails: {
        sizes: [
          {
            name: 'large',
            sourceUrl: 'https://picsum.photos/800/400',
            width: '800',
            height: '400'
          }
        ]
      }
    }
  ]
}} />