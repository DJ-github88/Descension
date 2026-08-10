/* eslint-disable no-restricted-globals */
// Self-destroying service worker to ensure all clients unregister legacy service workers
// and clear old CacheStorage caches permanently.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
      self.registration.unregister()
    ])
  );
});
