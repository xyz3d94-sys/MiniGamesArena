const CACHE_NAME = 'mg-arena-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/games.css'
];

// O'rnatish (Install) bosqichi: asosiy fayllarni keshga yig'ish
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Faollashish (Activate) bosqichi: eski keshni tozalash
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// So'rovlarni tutib olish (Fetch): internet bo'lmaganda keshdan ishlatish
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedRes) => {
      return cachedRes || fetch(e.request).catch(() => {
        // Agar internet ham, kesh ham bo'lmasa
        return caches.match('./index.html');
      });
    })
  );
});