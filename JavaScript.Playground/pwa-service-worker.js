"use strict";

const cacheName = "SAKryukov-JavaScript-Playground-cache";

const initialCachedResources = [
    "/",
    "/images",
    "/images/JavaScript-Playground.png",
    "/images/JavaScript-Playground.svg",
    "/help.html",
    "/index.html",
    "/index.js",
    "/playgroundAPI.js",
    "/pwa-service-worker.js",
];

self.addEventListener('install', function(e) {
  e.waitUntil((async () => {
    const cache = await caches.open(SAKryukov-JavaScript-Playground-cache);
    cache.addAll(initialCachedResources);
  })());
});

self.addEventListener('activate', function() {
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    e.respondWith(async () => {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(e.request);
      if (cachedResponse !== undefined)
          return cachedResponse;
  });
});
