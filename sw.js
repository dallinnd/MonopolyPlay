const CACHE_NAME = 'monosync-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json'
];

// Install Event: Cache the basic files
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch Event: Network-First Strategy (Great for development)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then(response => {
                // If the network fetch succeeds, update the cache with the fresh file
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                return response;
            })
            // If the network fails (offline), fall back to the cache
            .catch(() => caches.match(e.request))
    );
});
