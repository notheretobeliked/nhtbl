import * as server from '../entries/pages/portfolio/_page.server.ts.js';

export const index = 4;
export const component = async () => (await import('../entries/pages/portfolio/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/portfolio/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.15d22635.js","_app/immutable/chunks/index.c8d19c39.js","_app/immutable/chunks/Masonry.30f1fd0d.js"];
export const stylesheets = ["_app/immutable/assets/Masonry.e5b1e3c9.css"];
export const fonts = [];
