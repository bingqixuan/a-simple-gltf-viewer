importScripts("precache-manifest.50327a307e18ee37e664f4ddd80d2c3f.js", "workbox-v4.2.0/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.2.0"});
workbox.core.setCacheNameDetails({
    prefix: 'a-simple-gltf-viewer',
    suffix: 'v1',
});
// Control all opened tabs ASAP
workbox.core.clientsClaim();

/**
 * Use precaching list generated by workbox in build process.
 * https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.precaching
 */
workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerNavigationRoute('/index.html');

/**
 * Use runtime cache:
 * https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.routing#.registerRoute
 *
 * Workbox provides all common caching strategies including CacheFirst, NetworkFirst etc.
 * https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies
 */
workbox.routing.registerRoute(/(\.jpg|\.png|\.bin|\.gltf)$/, workbox.strategies.networkFirst());

/**
 * Response to client after skipping waiting with MessageChannel
 */
addEventListener('message', event => {
    const replyPort = event.ports[0];
    const message = event.data;
    if (replyPort && message && message.type === 'skip-waiting') {
        event.waitUntil(
            self
                .skipWaiting()
                .then(
                    () => replyPort.postMessage({ error: null }),
                    error => replyPort.postMessage({ error })
                )
        );
    }
});
