import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// SSR on Vercel — no static prerendering for now, so pages render on
		// demand and content updates show instantly. Functions run in London
		// (lhr1) to sit next to the WordPress backend and keep the per-request
		// GraphQL round-trip fast.
		adapter: adapter({
			runtime: 'nodejs20.x',
			regions: ['lhr1']
		}),
		alias: {
			$components: "src/components",
			$types: "src/types",
		  }
	},
	preprocess: vitePreprocess()
};

export default config;
