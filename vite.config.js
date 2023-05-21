import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server:{
		port:5013,
		strictPort:false,
		},
		preview:{
		port:4013,
		strictPort:false,
		}
		
});
