<script lang="ts">
  import { onMount } from 'svelte'
  import 'vidstack/bundle'

  onMount(async () => {
    // Ensure web components are defined
    await import('vidstack/player')
    await import('vidstack/player/layouts/default')
  })
</script>

<svelte:head>
    <title>Octopus Container Walkthrough Video</title>
    <meta property="og:title" content="Octopus Container Walkthrough Video">
</svelte:head>
<div class="bg-black w-screen h-screen flex items-center">
  <div class="w-full aspect-video">
    <media-player
      src="https://vz-d91f1127-2a2.b-cdn.net/a8cdee72-3b8a-4226-b502-49e55576c794/playlist.m3u8"
      view-type="video"
      controls
      autoplay
      poster="/octopus-poster.webp"
      class="w-full h-full"
      style="min-height: 100%; min-width: 100%; object-fit: cover;"
    >
      <media-provider></media-provider>
      <media-video-layout></media-video-layout>
    </media-player>
  </div>
</div>

<style>
  media-player {
    display: block;
    width: 100%;
    height: 100%;
  }

  :global(media-player video) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }
</style>
