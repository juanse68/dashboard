// Al instalar, activamos inmediatamente este SW
self.addEventListener('install', () => self.skipWaiting());

// Al activarse, tomamos control de las páginas abiertas
self.addEventListener('activate', () => self.clients.claim());

// Intercepción de peticiones: intentamos fetch y, si falla, buscamos en cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
