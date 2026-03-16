const CACHE_NAME = 'vozpublica-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.html',
  './css/style.css',
  './css/app.css',
  './js/main.js',
  './js/app.js',
  './js/ai.js',
  './js/analyzer.js',
  './js/geo.js',
  './assets/hero.png',
  './assets/logo.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first: API local do backend Python
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // Network-first: APIs externas
  const networkFirst = [
    'googleapis.com', 'elevenlabs.io',
    'overpass-api.de', 'nominatim.openstreetmap.org', 'viacep.com.br'
  ];
  if (networkFirst.some(h => url.hostname.includes(h))) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // Cache-first: assets locais
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./app.html');
        }
      })
    )
  );
});
