// Service worker manager for Mythrill VTT
// To prevent stale application versions and eliminate the need for hard resets (Ctrl+Shift+R),
// service workers are disabled and any existing registrations / caches are actively cleared.

export function register() {
  unregister();
}

export function unregister() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch((err) => {
          console.warn('[ServiceWorker] Failed to unregister worker:', err);
        });
      }
    }).catch((error) => {
      console.warn('[ServiceWorker] Error getting registrations:', error);
    });
  }

  if (typeof window !== 'undefined' && 'caches' in window) {
    caches.keys().then((keys) => {
      for (const key of keys) {
        caches.delete(key).catch((err) => {
          console.warn('[CacheStorage] Failed to delete cache:', key, err);
        });
      }
    }).catch((error) => {
      console.warn('[CacheStorage] Error querying cache keys:', error);
    });
  }
}
