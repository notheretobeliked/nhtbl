import * as server from '../entries/pages/portfolio/_page.server.ts.js';

export const index = 4;
export const component = async () => (await import('../entries/pages/portfolio/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/portfolio/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.a98c9dfd.js","_app/immutable/chunks/index.94f0a5ea.js","_app/immutable/chunks/Masonry.248c96e8.js"];
export const stylesheets = ["_app/immutable/assets/Masonry.e5b1e3c9.css"];
export const fonts = [];
