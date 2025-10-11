import * as server from '../entries/pages/portfolio/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/portfolio/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/portfolio/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.tWuPeIx6.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BW4kc09v.js","_app/immutable/chunks/DR6w8RCn.js","_app/immutable/chunks/YPB_bXxo.js","_app/immutable/chunks/DBknJ2Hn.js","_app/immutable/chunks/CmKjgJJm.js","_app/immutable/chunks/C2Z05ka8.js","_app/immutable/chunks/ta0yX_Ej.js","_app/immutable/chunks/B-69glJ1.js","_app/immutable/chunks/CmmGEhpf.js","_app/immutable/chunks/PhPhqHir.js"];
export const stylesheets = ["_app/immutable/assets/BlockRenderer.BNju4Aho.css","_app/immutable/assets/5.D1Nj_ybJ.css"];
export const fonts = [];
