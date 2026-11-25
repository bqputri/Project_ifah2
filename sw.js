// TypePaws Service Worker (PWA)
const CACHE_NAME = 'typepaws-cache-v1';

// Daftar aset inti yang di-cache untuk offline fallback
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/levels.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-apple-touch.png',
  '/icons/icon.svg',
  '/icons/favicon-32x32.png'
];

// 1. Install Event: Cache aset inti aplikasi
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Beberapa aset gagal di-cache saat install:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Bersihkan cache versi lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Menghapus cache usang:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Strategi caching cerdas
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // A. JANGAN PERNAH tangkap atau cache request non-GET (POST, PUT, DELETE)
  if (req.method !== 'GET') {
    return;
  }

  // B. JANGAN PERNAH cache request ke API lokal atau layanan cloud realtime/auth:
  // - /api/generate (Gemini AI)
  // - /api/rooms (Balapan online)
  // - /api/config
  // - Firebase Realtime Database WebSocket/REST (*.firebaseio.com)
  // - Firebase Auth (*.googleapis.com, *.firebaseapp.com)
  // - Supabase (*.supabase.co)
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebaseapp.com') ||
    url.hostname.includes('supabase.co')
  ) {
    // Langsung lewatkan ke jaringan tanpa caching
    return;
  }

  // C. Untuk dokumen HTML utama (Navigation Request):
  // Strategi Network First -> jika gagal/offline fallback ke Cache
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match(req).then((cachedRes) => {
            return cachedRes || caches.match('/index.html') || caches.match('/');
          });
        })
    );
    return;
  }

  // D. Untuk aset statis (JS, CSS, Gambar, Ikon, Suara):
  // Strategi Stale-While-Revalidate (ambil cepat dari cache, perbarui di latar belakang)
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          // Jaringan offline, tetap kembalikan dari cache jika ada
        });

      return cachedRes || fetchPromise;
    })
  );
});
