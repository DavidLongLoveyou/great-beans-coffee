// Service Worker for Core Web Vitals optimization
const CACHE_NAME = 'great-beans-coffee-v1';
const STATIC_CACHE_NAME = 'static-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/images/logo.svg',
  '/images/hero-background.svg',
  '/images/hero-coffee-beans.svg',
  '/images/coffee-placeholder.svg',
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(
              cacheName =>
                cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DYNAMIC_CACHE_NAME
            )
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  // Handle different types of requests
  if (request.destination === 'image') {
    // Images: Cache first, then network
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME));
  } else if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.startsWith('/_next/static/')
  ) {
    // Static assets: Cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('sitemap') ||
    url.pathname.includes('robots.txt')
  ) {
    // API and dynamic content: Network first
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else {
    // Pages: Stale while revalidate for better performance
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  }
});

// Cache first strategy - good for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline fallback if available
    return caches.match('/offline.html') || new Response('Offline');
  }
}

// Network first strategy - good for dynamic content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline');
  }
}

// Stale while revalidate - good for pages
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  // This could include form submissions, analytics, etc.
}

// Push notifications (if needed)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/logo.svg',
      badge: '/images/logo.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey,
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});
