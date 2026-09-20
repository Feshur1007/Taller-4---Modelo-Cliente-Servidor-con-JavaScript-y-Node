const VERSION = "tienda-libros-v1";
const SHELL_CACHE = VERSION + "-shell";
const API_CACHE = VERSION + "-api";

const SHELL_FILES = [
	"./",
	"./index.html",
	"./catalog.html",
	"./offline.html",
	"./manifest.webmanifest",
	"./css/styles.css",
	"./js/main.js",
	"./js/catalog.js",
	"./js/theme.js",
	"./js/services/api.js",
	"./js/ui/ui.js",
	"./icons/icon-192.png",
	"./icons/icon-512.png",
	"./icons/maskable-512.png"
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(SHELL_CACHE)
			.then((cache) => cache.addAll(SHELL_FILES))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys()
			.then((keys) => Promise.all(keys
				.filter((key) => key.startsWith("tienda-libros-") && key !== SHELL_CACHE && key !== API_CACHE)
				.map((key) => caches.delete(key))
			))
			.then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", (event) => {
	const request = event.request;
	if (request.method !== "GET") return;
	const url = new URL(request.url);

	if (url.pathname.startsWith("/api/")) {
		event.respondWith(
			fetch(request)
				.then((res) => {
					const copia = res.clone();
					caches.open(API_CACHE).then((cache) => cache.put(request, copia));
					return res;
				})
				.catch(() => caches.match(request).then((cacheada) =>
					cacheada || new Response("[]", { headers: { "Content-Type": "application/json" } })
				))
		);
		return;
	}

	event.respondWith(
		caches.match(request, { ignoreSearch: true }).then((cacheada) =>
			cacheada || fetch(request)
				.then((res) => {
					const copia = res.clone();
					caches.open(SHELL_CACHE).then((cache) => cache.put(request, copia));
					return res;
				})
				.catch(() => {
					if (request.mode === "navigate") {
						return caches.match("./offline.html");
					}
					throw new Error("offline");
				})
		)
	);
});
