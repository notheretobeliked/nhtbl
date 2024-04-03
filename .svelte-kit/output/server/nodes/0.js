import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
export const component = async () => (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.619ff4b2.js","_app/immutable/chunks/index.c8d19c39.js","_app/immutable/chunks/stores.9a0efd23.js","_app/immutable/chunks/singletons.ec185c79.js","_app/immutable/chunks/index.4d9eb4ae.js"];
export const stylesheets = ["_app/immutable/assets/0.a5ed4463.css"];
export const fonts = [];
