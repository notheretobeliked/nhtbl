import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.Ogb5o1RU.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CmmGEhpf.js","_app/immutable/chunks/BW4kc09v.js","_app/immutable/chunks/CmKjgJJm.js","_app/immutable/chunks/DR6w8RCn.js","_app/immutable/chunks/YPB_bXxo.js","_app/immutable/chunks/DBknJ2Hn.js","_app/immutable/chunks/B-69glJ1.js","_app/immutable/chunks/C2Z05ka8.js","_app/immutable/chunks/ta0yX_Ej.js","_app/immutable/chunks/PhPhqHir.js"];
export const stylesheets = ["_app/immutable/assets/BlockRenderer.BNju4Aho.css"];
export const fonts = [];
