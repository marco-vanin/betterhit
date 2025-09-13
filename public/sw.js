const CACHE_NAME = 'hitster-helper-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/songs.json',
  '/manifest.json'
];

// Installation - Cache des assets statiques
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation - Nettoie les anciens caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Stratégie Cache First pour les assets, Network First pour le reste
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache First pour songs.json et assets statiques
  if (url.pathname === '/songs.json' || STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
        .catch(() => {
          // Offline fallback pour songs.json
          if (url.pathname === '/songs.json') {
            return new Response('{"error": "Offline"}', {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        })
    );
  }
  // Network First pour YouTube et autres APIs externes
  else if (url.origin !== location.origin) {
    event.respondWith(
      fetch(request).catch(() => {
        // Pas de cache pour les APIs externes
        return new Response('Network Error', { status: 408 });
      })
    );
  }
});