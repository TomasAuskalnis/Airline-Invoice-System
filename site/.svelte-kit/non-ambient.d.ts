
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
		RouteId(): "/" | "/aircraft" | "/contact" | "/flights" | "/login" | "/tableAircraft" | "/tableFlights" | "/tableRoutes" | "/tableUsers" | "/users";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/aircraft": Record<string, never>;
			"/contact": Record<string, never>;
			"/flights": Record<string, never>;
			"/login": Record<string, never>;
			"/tableAircraft": Record<string, never>;
			"/tableFlights": Record<string, never>;
			"/tableRoutes": Record<string, never>;
			"/tableUsers": Record<string, never>;
			"/users": Record<string, never>
		};
		Pathname(): "/" | "/aircraft" | "/contact" | "/flights" | "/login" | "/tableAircraft" | "/tableFlights" | "/tableRoutes" | "/tableUsers" | "/users";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/aircraft.jpg" | "/background.jpg" | "/flights.jpg" | "/robots.txt" | "/users.jpg" | string & {};
	}
}