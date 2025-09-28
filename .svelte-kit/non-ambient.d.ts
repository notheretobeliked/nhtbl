
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/octopus-walkthrough" | "/portfolio" | "/portfolio/[slug]" | "/[...all]";
		RouteParams(): {
			"/portfolio/[slug]": { slug: string };
			"/[...all]": { all: string }
		};
		LayoutParams(): {
			"/": { slug?: string; all?: string };
			"/octopus-walkthrough": Record<string, never>;
			"/portfolio": { slug?: string };
			"/portfolio/[slug]": { slug: string };
			"/[...all]": { all: string }
		};
		Pathname(): "/" | "/octopus-walkthrough" | "/octopus-walkthrough/" | "/portfolio" | "/portfolio/" | `/portfolio/${string}` & {} | `/portfolio/${string}/` & {} | `/${string}` & {} | `/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/Nhtbl-logo.webp" | "/android-chrome-144x144.png" | "/apple-touch-icon.png" | "/breakdown/bg.jpg" | "/breakdown/climate-chaos.jpg" | "/breakdown/drought_1500.jpg" | "/breakdown/earthonfire.jpeg" | "/breakdown/forest-fire-lg.jpg" | "/breakdown/polarbear.avif" | "/breakdown/police.jpeg" | "/breakdown/police2.webp" | "/browserconfig.xml" | "/favicon-16x16.png" | "/favicon-32x32.png" | "/favicon.ico" | "/fonts/Avara-Bold.woff" | "/fonts/Avara-Bold.woff2" | "/fonts/Avara-BoldItalic.woff" | "/fonts/Avara-BoldItalic.woff2" | "/fonts/InterTight-Medium.ttf" | "/fonts/InterTight-MediumItalic.ttf" | "/fonts/Typefesse_Claire-Obscure.woff2" | "/fonts/Typefesse_Pleine.woff2" | "/mstile-150x150.png" | "/nhtbl-logotype.svg" | "/nhtbl_globe.png" | "/octopus-poster.webp" | "/robots.txt" | "/safari-pinned-tab.svg" | "/site.webmanifest" | "/svgs/details-off.svg" | "/svgs/details-on.svg" | "/svgs/line.svg" | "/svgs/masonry-off.svg" | "/svgs/masonry-on.svg" | "/thingy.png" | string & {};
	}
}