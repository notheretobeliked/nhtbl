export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["Nhtbl-logo.png","breakdown/bg.jpg","breakdown/climate-chaos.jpg","breakdown/drought_1500.jpg","breakdown/earthonfire.jpeg","breakdown/forest-fire-lg.jpg","breakdown/polarbear.avif","breakdown/police.jpeg","breakdown/police2.webp","favicon.png","fonts/Avara-Bold.woff","fonts/Avara-Bold.woff2","fonts/Avara-BoldItalic.woff","fonts/Avara-BoldItalic.woff2","fonts/InterTight-Medium.ttf","fonts/InterTight-MediumItalic.ttf","svgs/line.svg","thingy.png"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".avif":"image/avif",".webp":"image/webp",".woff":"font/woff",".woff2":"font/woff2",".ttf":"font/ttf",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.d22a8019.js","app":"_app/immutable/entry/app.c6889a46.js","imports":["_app/immutable/entry/start.d22a8019.js","_app/immutable/chunks/index.c8d19c39.js","_app/immutable/chunks/singletons.ec185c79.js","_app/immutable/chunks/index.4d9eb4ae.js","_app/immutable/entry/app.c6889a46.js","_app/immutable/chunks/index.c8d19c39.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js')
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
