/* Flipwave service worker - build 1.0.0-9821be38 (this file changes every build, which is what triggers updates) */
'use strict';
var CACHE = 'flipwave-1.0.0-9821be38';
var ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  var isPage = req.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(req.url).pathname);
  if (isPage) {   // network first so a new build always wins when online; cache keeps it playable offline
    e.respondWith(fetch(req, { cache: 'no-store' }).then(function (r) { var c = r.clone(); caches.open(CACHE).then(function (ca) { ca.put('index.html', c); }); return r; })
      .catch(function () { return caches.match('index.html'); }));
  } else {
    e.respondWith(caches.match(req).then(function (m) { return m || fetch(req); }));
  }
});
