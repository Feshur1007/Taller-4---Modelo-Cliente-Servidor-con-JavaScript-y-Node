const VERSION = "tienda-libros-v2";
const SHELL_CACHE = "shell-" + VERSION;
const API_CACHE = "data-" + VERSION;

const SHELL_FILES = [
	"/",
	"/index.html",
	"/catalog.html",
	"/offline.html",
	"/css/styles.css",
	"/js/main.js",
	"/js/catalog.js",
	"/js/theme.js",
	"/js/pwa.js",
	"/js/services/api.js",
	"/js/ui/ui.js",
	"/manifest.webmanifest",
	"/icons/icon-192.png",
	"/icons/icon-512.png",
	"/icons/maskable-512.png"
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
				.filter((key) => key !== SHELL_CACHE && key !== API_CACHE)
				.map((key) => caches.delete(key))
			))
			.then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", (event) => {
	const request = event.request;
	const url = new URL(request.url);

	if (request.method !== "GET" || url.origin !== self.location.origin) return;

	if (url.pathname.startsWith("/api/")) {
		event.respondWith(networkFirst(request));
		return;
	}

	event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
	const cache = await caches.open(API_CACHE);
	try {
		const response = await fetch(request);
		cache.put(request, response.clone());
		return response;
	} catch (e) {
		const guardada = await cache.match(request);
		if (guardada) return guardada;
		return new Response(JSON.stringify({ error: "Sin conexión" }), {
			status: 503,
			headers: { "Content-Type": "application/json" }
		});
	}
}

async function cacheFirst(request) {
	const guardada = await caches.match(request);
	if (guardada) return guardada;
	try {
		const response = await fetch(request);
		const cache = await caches.open(SHELL_CACHE);
		cache.put(request, response.clone());
		return response;
	} catch (e) {
		if (request.mode === "navigate") {
			const offline = await caches.match("/offline.html");
			if (offline) return offline;
		}
		return Response.error();
	}
}
