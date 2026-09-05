// Service Worker | JavaScript
// Offline caching for NYTM Tools — the "Airplane Mode" promise from apprules.md.
// Strategy: cache-first for static assets, stale-while-revalidate for pages.
// Bump CACHE_VERSION to invalidate old caches on deploy.

const CACHE_VERSION = "nytm-v2.5.0";
const CACHE = `nytm-cache-${CACHE_VERSION}`;

// Never touch analytics, external APIs, or non-GET — let them hit the network raw.
function isCacheable(request, url) {
  if (request.method !== "GET") return false;
  if (url.origin !== self.location.origin) return false; // external (ipinfo, huggingface, razorpay)
  if (url.pathname.startsWith("/ingest/")) return false; // PostHog proxy
  if (url.pathname.startsWith("/api/")) return false; // dynamic routes (http-headers)
  return true;
}

self.addEventListener("install", (event) => {
  // Pre-cache the shell so a cold offline start still renders.
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(["/", "/tools", "/manifest.webmanifest"]).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Drop caches from older versions.
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (!isCacheable(request, url)) return; // default: browser handles it, straight to network

  // Stale-while-revalidate: serve cache instantly, refresh in the background.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached); // offline: fall back to whatever we have
      return cached || network;
    })
  );
});
