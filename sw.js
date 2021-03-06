<<<<<<< HEAD
// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  './', // Alias for index.html
  'manifest.json',
  'src/my-app.html'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
=======
importScripts('/src/js/sw-lib.min.js');
const cdnCacheStrategy = goog.swlib.cacheFirst({cacheableResponse: {statuses: [0]}});
goog.swlib.router.registerRoute(new RegExp('^https://cdn.jsdelivr.net/lodash'), cdnCacheStrategy);
goog.swlib.router.registerRoute(new RegExp('^https://www.gstatic.com/firebasejs/3.7.2/firebase.js'), cdnCacheStrategy);
goog.swlib.router.registerRoute('/sw.js', goog.swlib.networkFirst());
goog.swlib.router.registerRoute('/', goog.swlib.staleWhileRevalidate());
goog.swlib.router.registerRoute('/index.html', goog.swlib.staleWhileRevalidate());
goog.swlib.router.registerRoute(new RegExp('.html|.css|.js'), goog.swlib.cacheFirst());
>>>>>>> 1f2204404ccfdaf3a73b387ec314699dc3021a38
