import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DgwNhi5Q.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CmmGEhpf.js","_app/immutable/chunks/BW4kc09v.js","_app/immutable/chunks/CmKjgJJm.js","_app/immutable/chunks/DR6w8RCn.js","_app/immutable/chunks/YPB_bXxo.js","_app/immutable/chunks/DBknJ2Hn.js","_app/immutable/chunks/zVJ5bPBF.js","_app/immutable/chunks/-m-AuBLE.js","_app/immutable/chunks/C2Z05ka8.js"];
export const stylesheets = ["_app/immutable/assets/0.DN-bbGOV.css"];
export const fonts = [];
