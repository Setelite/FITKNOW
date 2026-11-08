const CACHE_NAME = 'fitknow-minimal-2026-v6-photo';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg', './assets/fitness-couple.webp', './assets/fitness-couple-clean.webp', './stickers/dumbbell.svg', './stickers/apple.svg', './stickers/chart.svg', './stickers/heart.svg', './stickers/clipboard.svg', './stickers/flame.svg', './stickers/water.svg', './stickers/check.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('fitknow-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => caches.match(event.request).then(response => response || caches.match('./index.html'))));
});
