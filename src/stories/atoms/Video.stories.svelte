<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Video from '../../components/atoms/Video.svelte';

  // Mock video data
  const createMockVideo = (title, url, poster = null) => ({
    title,
    mediaDetails: {
      file: url
    },
    altText: `${title} video`,
    ...(poster && { poster })
  });

  const { Story } = defineMeta({
    title: 'Atoms/Video',
    component: Video,
    tags: ['autodocs'],
    argTypes: {
      autoplay: {
        control: 'boolean'
      },
      muted: {
        control: 'boolean'
      },
      loop: {
        control: 'boolean'
      },
      controls: {
        control: 'boolean'
      }
    },
    args: {
      video: createMockVideo(
        'Sample Video',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      ),
      autoplay: false,
      muted: false,
      loop: false,
      controls: true
    }
  });
</script>

<Story name="Default" />

<Story name="Autoplay Muted" args={{
  autoplay: true,
  muted: true,
  loop: true
}} />

<Story name="No Controls" args={{
  controls: false
}} />

<Story name="With Poster" args={{
  video: createMockVideo(
    'Video with Poster',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://picsum.photos/800/450',
  )
}} />

<Story name="Looping Background Video" args={{
  video: createMockVideo(
    'Background Video',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  ),
  autoplay: true,
  muted: true,
  loop: true,
  controls: false
}} />

<Story name="Different Aspect Ratios" args={{}} let:args>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold mb-2">Wide Video</h3>
      <div class="max-w-2xl">
        <Video 
          video={createMockVideo('Wide Video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
          controls={true}
        />
      </div>
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-2">Square-ish Video</h3>
      <div class="max-w-md">
        <Video 
          video={createMockVideo('Square Video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4')}
          controls={true}
        />
      </div>
    </div>
  </div>
</Story>