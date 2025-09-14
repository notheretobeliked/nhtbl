export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","Nhtbl-logo.webp","android-chrome-144x144.png","apple-touch-icon.png","breakdown/bg.jpg","breakdown/climate-chaos.jpg","breakdown/drought_1500.jpg","breakdown/earthonfire.jpeg","breakdown/forest-fire-lg.jpg","breakdown/polarbear.avif","breakdown/police.jpeg","breakdown/police2.webp","browserconfig.xml","favicon-16x16.png","favicon-32x32.png","favicon.ico","fonts/Avara-Bold.woff","fonts/Avara-Bold.woff2","fonts/Avara-BoldItalic.woff","fonts/Avara-BoldItalic.woff2","fonts/InterTight-Medium.ttf","fonts/InterTight-MediumItalic.ttf","fonts/Typefesse_Claire-Obscure.woff2","fonts/Typefesse_Pleine.woff2","mstile-150x150.png","robots.txt","safari-pinned-tab.svg","site.webmanifest","svgs/line.svg","thingy.png"]),
	mimeTypes: {".webp":"image/webp",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".avif":"image/avif",".xml":"text/xml",".woff":"font/woff",".woff2":"font/woff2",".ttf":"font/ttf",".txt":"text/plain",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.Cgh-qlpD.js","app":"_app/immutable/entry/app.BNLHZHnS.js","imports":["_app/immutable/entry/start.Cgh-qlpD.js","_app/immutable/chunks/entry.LobBh7oK.js","_app/immutable/chunks/scheduler.ddasmCk9.js","_app/immutable/entry/app.BNLHZHnS.js","_app/immutable/chunks/scheduler.ddasmCk9.js","_app/immutable/chunks/index.DFEeQC1i.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/portfolio",
				pattern: /^\/portfolio\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/portfolio/[slug]",
				pattern: /^\/portfolio\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/[...all]",
				pattern: /^(?:\/(.*))?\/?$/,
				params: [{"name":"all","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
