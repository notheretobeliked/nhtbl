import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	// svelte-bricks ships uncompiled .svelte files; let Vite/Svelte process them
	// for SSR instead of treating them as an external module.
	ssr: {
		noExternal: ['svelte-bricks']
	}
});
