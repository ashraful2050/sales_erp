/**
 * AccounTech BD — Service Worker
 * Provides: offline caching, push notifications, background sync
 */

const CACHE_VERSION = "v1";
const SHELL_CACHE = `at-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `at-assets-${CACHE_VERSION}`;
const IMAGE_CACHE = `at-images-${CACHE_VERSION}`;

/** URLs to cache immediately on install (the app shell) */
const PRECACHE_URLS = [
    "/",
    "/offline.html",
    "/site.webmanifest",
    "/logo-192.png",
    "/logo-512.png",
    "/logo-64.png",
    "/favicon.ico",
];

// ─── Install ───────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(SHELL_CACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting()),
    );
});

// ─── Activate ──────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
    const keep = [SHELL_CACHE, ASSET_CACHE, IMAGE_CACHE];
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => !keep.includes(k))
                        .map((k) => caches.delete(k)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

// ─── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle same-origin GET requests
    if (request.method !== "GET") return;
    if (!["http:", "https:"].includes(url.protocol)) return;
    if (url.origin !== self.location.origin) return;

    // Never cache: auth, API, logout, translations, debug
    const bypass = [
        "/logout",
        "/login",
        "/register",
        "/api/",
        "/sanctum/",
        "/_debugbar/",
        "/translations",
    ];
    if (bypass.some((p) => url.pathname.startsWith(p))) return;

    // ── Vite hashed bundles → Cache-first (immutable filenames) ──────────
    if (url.pathname.startsWith("/build/")) {
        event.respondWith(cacheFirst(request, ASSET_CACHE));
        return;
    }

    // ── Images → Cache-first ─────────────────────────────────────────────
    if (request.destination === "image") {
        event.respondWith(cacheFirst(request, IMAGE_CACHE));
        return;
    }

    // ── HTML navigation → Network-first, offline fallback ────────────────
    if (request.mode === "navigate") {
        event.respondWith(networkFirstNav(request));
        return;
    }
});

// ─── Strategies ────────────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        return new Response("Offline", { status: 503 });
    }
}

async function networkFirstNav(request) {
    const cache = await caches.open(SHELL_CACHE);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        // Cached exact page
        const cached = await cache.match(request);
        if (cached) return cached;

        // SPA root shell (inertia will handle the route client-side)
        const root = await cache.match("/");
        if (root) return root;

        // Ultimate fallback
        return cache.match("/offline.html");
    }
}

// ─── Push Notifications ────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
    if (!event.data) return;

    let data;
    try {
        data = event.data.json();
    } catch {
        data = { title: "AccounTech BD", body: event.data.text() };
    }

    const options = {
        body: data.body || "",
        icon: data.icon || "/logo-192.png",
        badge: data.badge || "/logo-64.png",
        image: data.image,
        vibrate: [100, 50, 100],
        tag: data.tag || "at-default",
        renotify: true,
        data: { url: data.url || "/" },
        actions: data.actions || [],
    };

    event.waitUntil(
        self.registration.showNotification(
            data.title || "AccounTech BD",
            options,
        ),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === targetUrl && "focus" in client) {
                        return client.focus();
                    }
                }
                return clients.openWindow
                    ? clients.openWindow(targetUrl)
                    : null;
            }),
    );
});

// ─── Background Sync (for offline form submissions) ───────────────────────
self.addEventListener("sync", (event) => {
    if (event.tag === "background-sync") {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Posts queued while offline would be retried here
    // Implementation depends on specific needs
}
// ─── Skip-waiting message ─────────────────────────────────────────────────
self.addEventListener("message", (event) => {
    if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
