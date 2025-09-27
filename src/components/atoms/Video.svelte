<script lang="ts">
	interface Props {
		src: string;
		autoplay?: boolean;
		controls?: boolean;
		loop?: boolean;
		muted?: boolean;
		playsInline?: boolean;
		preload?: 'none' | 'metadata' | 'auto' | string;
		extraClasses?: string;
		fit?: 'cover' | 'contain' | 'fill' | 'none';
	}

	let {
		src,
		autoplay = false,
		controls = true,
		loop = false,
		muted = false,
		playsInline = false,
		preload = 'metadata',
		extraClasses = '',
		fit = 'none'
	}: Props = $props();

	const fitClass = fit === 'cover' ? 'object-cover' : 
		fit === 'contain' ? 'object-contain' : 
		fit === 'fill' ? 'object-fill' : 
		'object-none';
</script>

<div class="relative w-full max-w-none flex justify-center">
	<video
		class={`w-full h-full ${fitClass} ${extraClasses}`}
		{src}
		{autoplay}
		{controls}
		{loop}
		{muted}
		preload={preload as 'none' | 'metadata' | 'auto'}
		playsinline={playsInline}
	>
		Your browser does not support the video tag.
	</video>
</div>
