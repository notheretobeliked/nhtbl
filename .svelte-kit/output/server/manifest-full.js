export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","Nhtbl-logo.webp","android-chrome-144x144.png","apple-touch-icon.png","breakdown/bg.jpg","breakdown/climate-chaos.jpg","breakdown/drought_1500.jpg","breakdown/earthonfire.jpeg","breakdown/forest-fire-lg.jpg","breakdown/polarbear.avif","breakdown/police.jpeg","breakdown/police2.webp","browserconfig.xml","favicon-16x16.png","favicon-32x32.png","favicon.ico","fonts/Avara-Bold.woff","fonts/Avara-Bold.woff2","fonts/Avara-BoldItalic.woff","fonts/Avara-BoldItalic.woff2","fonts/InterTight-Medium.ttf","fonts/InterTight-MediumItalic.ttf","fonts/Typefesse_Claire-Obscure.woff2","fonts/Typefesse_Pleine.woff2","mstile-150x150.png","nhtbl-logotype.svg","nhtbl_globe.png","octopus-poster.webp","robots.txt","safari-pinned-tab.svg","site.webmanifest","svgs/details-off.svg","svgs/details-on.svg","svgs/line.svg","svgs/masonry-off.svg","svgs/masonry-on.svg","thingy.png"]),
	mimeTypes: {".webp":"image/webp",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".avif":"image/avif",".xml":"text/xml",".woff":"font/woff",".woff2":"font/woff2",".ttf":"font/ttf",".svg":"image/svg+xml",".txt":"text/plain",".webmanifest":"application/manifest+json"},
	_: {
		client: {start:"_app/immutable/entry/start.BR6oETqI.js",app:"_app/immutable/entry/app.D2rL8xGX.js",imports:["_app/immutable/entry/start.BR6oETqI.js","_app/immutable/chunks/-m-AuBLE.js","_app/immutable/chunks/BW4kc09v.js","_app/immutable/chunks/DBknJ2Hn.js","_app/immutable/entry/app.D2rL8xGX.js","_app/immutable/chunks/D6kgxu3v.js","_app/immutable/chunks/CUSLTjzl.js","_app/immutable/chunks/BW4kc09v.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DR6w8RCn.js","_app/immutable/chunks/YPB_bXxo.js","_app/immutable/chunks/DBknJ2Hn.js","_app/immutable/chunks/PhPhqHir.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/octopus-walkthrough",
				pattern: /^\/octopus-walkthrough\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/plas/event",
				pattern: /^\/plas\/event\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/plas/event/_server.js'))
			},
			{
				id: "/plas/script.js",
				pattern: /^\/plas\/script\.js\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/plas/script.js/_server.js'))
			},
			{
				id: "/portfolio/[slug]",
				pattern: /^\/portfolio\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/preview",
				pattern: /^\/preview\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/[...all]",
				pattern: /^(?:\/([^]*))?\/?$/,
				params: [{"name":"all","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
