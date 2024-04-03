import * as server from '../entries/pages/_...all_/_page.server.ts.js';

export const index = 3;
export const component = async () => (await import('../entries/pages/_...all_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[...all]/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.2d89aefb.js","_app/immutable/chunks/index.c8d19c39.js","_app/immutable/chunks/BlockRenderer.05905ecb.js","_app/immutable/chunks/Masonry.30f1fd0d.js","_app/immutable/chunks/index.4d9eb4ae.js"];
export const stylesheets = ["_app/immutable/assets/BlockRenderer.b6f168f5.css","_app/immutable/assets/Masonry.e5b1e3c9.css"];
export const fonts = [];
