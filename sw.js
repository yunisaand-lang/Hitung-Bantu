/* ============================================================
   sw.js  -  Service Worker HitungBantu
   Tugasnya: menyimpan semua file aplikasi di HP (cache),
   supaya aplikasi tetap bisa dibuka tanpa internet.
   ============================================================ */

// Nama cache. KALAU KAMU MENGUBAH isi index.html, ganti angka versinya
// (v1 -> v2) supaya HP mengambil file yang baru.
const CACHE = 'hitungbantu-v1';

// Daftar file yang disimpan di HP. Nama harus sama persis dengan nama file.
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1) INSTALL: dijalankan sekali saat pertama kali dibuka (harus online).
//    Semua file di daftar FILES disimpan ke cache.
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

// 2) ACTIVATE: hapus cache versi lama supaya HP tidak penuh.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 3) FETCH: setiap kali aplikasi meminta file, cek cache dulu.
//    Kalau ada, pakai dari cache (cepat dan tanpa internet).
//    Kalau tidak ada, baru ambil dari internet.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return (
        cached ||
        fetch(e.request).catch(() => caches.match('./index.html'))
      );
    })
  );
});
