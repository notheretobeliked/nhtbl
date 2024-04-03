import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
export const component = async () => (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.a5eb34d5.js","_app/immutable/chunks/index.94f0a5ea.js","_app/immutable/chunks/stores.d3f8cf98.js","_app/immutable/chunks/singletons.2528fd9a.js","_app/immutable/chunks/index.bdd37eca.js"];
export const stylesheets = ["_app/immutable/assets/0.162386cc.css"];
export const fonts = [];
