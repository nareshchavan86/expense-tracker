const CACHE_NAME = 'expense-tracker-v3';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Never cache Google API calls
    if (url.hostname.includes('google') || url.hostname.includes('gstatic')) {
        event.respondWith(fetch(event.request).catch(() =>
            new Response(JSON.stringify({ error: 'Offline' }), {
                headers: { 'Content-Type': 'application/json' }
            })
        ));
        return;
    }

    // Cache-first for app files
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) {
                fetch(event.request).then(res => {
                    caches.open(CACHE_NAME).then(c => c.put(event.request, res));
                }).catch(() => {});
                return cached;
            }
            return fetch(event.request).then(res => {
                if (res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                }
                return res;
            });
        }).catch(() => {
            if (event.request.destination === 'document') return caches.match('/index.html');
        })
    );
});
