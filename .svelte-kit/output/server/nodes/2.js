import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
export const component = async () => (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.8cf3392c.js","_app/immutable/chunks/index.94f0a5ea.js","_app/immutable/chunks/BlockRenderer.ec635a8d.js","_app/immutable/chunks/Masonry.248c96e8.js","_app/immutable/chunks/index.bdd37eca.js"];
export const stylesheets = ["_app/immutable/assets/BlockRenderer.b6f168f5.css","_app/immutable/assets/Masonry.e5b1e3c9.css"];
export const fonts = [];
