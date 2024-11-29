const CACHE_NAME = 'offline';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
    })());
});

self.addEventListener('fetch', (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                // First, try to use the navigation preload response if it's supported.
                // const preloadResponse = await event.preloadResponse;
                // if (preloadResponse) {
                //     return preloadResponse;
                // }

                const response =  await fetch(event.request);
                console.log("response->->", response)
                return response
            } catch (error) {
                // catch is only triggered if an exception is thrown, which is likely
                // due to a network error.
                // If fetch() returns a valid HTTP response with a response code in
                // the 4xx or 5xx range, the catch() will NOT be called.
                const cache = await caches.open(CACHE_NAME);

                if(event.request.url.includes("/video.mp4")) {
                    return await cache.match(event.request.url, { ignoreSearch: true });
                } else {
                    return await cache.match(OFFLINE_URL);
                }

            }
        })());
    }
});

self.addEventListener('fetch', (event) => {
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        return await cache.match(event.request.url, { ignoreSearch: true });
    })());
});
