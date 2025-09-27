import * as server from '../entries/pages/portfolio/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/portfolio/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/portfolio/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.CAsoQWyR.js","_app/immutable/chunks/scheduler.ddasmCk9.js","_app/immutable/chunks/index.DFEeQC1i.js","_app/immutable/chunks/each.DiG0s2YL.js","_app/immutable/chunks/entry.LobBh7oK.js","_app/immutable/chunks/stores.QsGV6GoJ.js","_app/immutable/chunks/Masonry.svelte_svelte_type_style_lang.Dj3rNXob.js"];
export const stylesheets = ["_app/immutable/assets/Masonry.C5IyxnA_.css"];
export const fonts = [];
