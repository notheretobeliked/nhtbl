import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
export const component = async () => (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.41724b94.js","_app/immutable/chunks/index.c8d19c39.js","_app/immutable/chunks/BlockRenderer.05905ecb.js","_app/immutable/chunks/Masonry.30f1fd0d.js","_app/immutable/chunks/index.4d9eb4ae.js"];
export const stylesheets = ["_app/immutable/assets/BlockRenderer.b6f168f5.css","_app/immutable/assets/Masonry.e5b1e3c9.css"];
export const fonts = [];
