// Haypi Dragon Remaster - Service Worker v1.0.0
const CACHE_NAME = 'haypi-dragon-cache-v1';

const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './haypi_full_data.js',
    './icons/icon-180.png',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png',
    './res/drawable-mdpi/title_bg.jpg',
    './res/drawable-mdpi/title_logo.png',
    './res/drawable-mdpi/title_bar.png',
    './res/drawable-mdpi/title_tips.png',
    './res/drawable-mdpi/zhucheng_bg.jpg',
    './res/drawable-mdpi/adv_map.jpg',
    './res/drawable-mdpi/map_ground01.png',
    './res/drawable-mdpi/map_ground02.png',
    './images/ingame/hd/ingame_bg.png',
    './font/FONTH___.TTF'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_ASSETS).catch((err) => {
                console.warn('Pre-cache partial fail, will cache on demand:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Ignore peerjs / remote cdn if failed
    const url = new URL(event.request.url);

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
                // Fetch in background to update cache (stale-while-revalidate for local files)
                fetch(event.request).then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkRes);
                        });
                    }
                }).catch(() => {/* offline fallback */});
                return cached;
            }

            return fetch(event.request).then((networkRes) => {
                if (!networkRes || networkRes.status !== 200 || networkRes.type !== 'basic') {
                    return networkRes;
                }
                const responseToCache = networkRes.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return networkRes;
            }).catch(() => {
                // If offline and request is HTML, return cached index
                if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
