/* English Coach — service worker.
 * Makes the app installable and usable offline. Strategy:
 *  - Precache the app shell on install.
 *  - Same-origin GETs: stale-while-revalidate (instant load + background refresh).
 *  - Navigations that fail offline fall back to the cached index.html.
 * Bump CACHE when you ship changes so clients pick them up.
 */
const CACHE = "english-coach-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/data/vocabulary.js",
  "./js/data/business.js",
  "./js/data/technical.js",
  "./js/data/tenses.js",
  "./js/data/grammar.js",
  "./js/data/idioms.js",
  "./js/data/curriculum.js",
  "./js/store.js",
  "./js/speech.js",
  "./js/ai.js",
  "./js/games.js",
  "./js/app.js",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  if (!sameOrigin) return; // let cross-origin (e.g. fonts) go to network

  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
