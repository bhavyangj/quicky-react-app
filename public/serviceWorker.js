//STORAGE OF BROWSER
const CACHE_NAME = "version-1";
const urlsToCache = [
	"/static/js/main.chunk.js",
	"/static/js/0.chunk.js",
	"/static/js/bundle.js",
	"/index.html",
	"/",
];
const self = this;

//installation
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			// console.log("Opened cache");
			return cache.addAll(urlsToCache);
		})
	);
});

// listen for request
self.addEventListener("fetch", (event) => {
	setNotiCount(0);
	event.respondWith(
		caches.match(event.request).then((res) => {
			return fetch(event.request)
				.then((resp) => {
					if (resp) {
						return resp;
					}
				})
				.catch(() => caches.match("index.html"));
		})
	);
});

// actitivate the service worker
self.addEventListener("activate", (event) => {
	const cacheWhitelist = [];
	cacheWhitelist.push(CACHE_NAME);
	event.waitUntil(
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames.map((cacheName) => {
					if (!cacheWhitelist.includes(cacheName)) {
						return caches.delete(cacheName);
					}
				})
			)
		)
	);
});

const setNotiCount = (count = 0) => {
	if ("setAppBadge" in navigator) {
		navigator.setAppBadge(count);
	}
};

self.addEventListener("notificationclick", function (event) {
	// clients.openWindow("/");
	event.notification.close();
	// console.log(event);
	if (event.action === "open") {
		window.focus();
	} else if (event.action === "close") {
		event.notification.close();
	}

	// console.log("On notification click: ", event.notification.tag);
	// This looks to see if the current is already open and
	// focuses if it is
	event.waitUntil(
		self.clients
			.matchAll({
				type: "window",
			})
			.then((clientList) => {
				for (const client of clientList) {
					if (client.url === "/chats" && "focus" in client)
						return client.focus();
				}
				if (self.clients.openWindow) return self.clients.openWindow("/chats");
			})
	);
});
