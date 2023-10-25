"use strict";

const cacheName = "SAKryukov-JavaScript-Playground-cache";

const initialCachedResources = [
    "/",
    "/images/JavaScript-Playground.png",
    "/images/JavaScript-Playground.svg",
    "/help.html",
    "/index.html",
    "/index.js",
    "/playgroundAPI.js",
];

self.addEventListener('install', function(event) {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    cache.addAll(initialCachedResources);
  })());
});

// self.addEventListener('activate', function() {
//  return self.clients.claim();
// });

self.addEventListener('fetch', function(event) {
    event.respondWith(async () => {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse == null) { // not in the cache, try the network:
        try {
          const fetchResponse = await fetch(event.request);
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (exception) {
          console.log(exception.toString());
        } 
      } else
        return cachedResponse;
  });
});
