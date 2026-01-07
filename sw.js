const cacheName = 'v1';

self.addEventListener('install', e => {
    self.skipWaiting(); // নতুন ভার্সন আসলে সাথে সাথে আপডেট হবে
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
