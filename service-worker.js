self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('cache-v1').then((cache) => {
        return cache.addAll([
          './',
          './index.html',
          './styles.css',
          './tarjetas.js',
          './script.js',
          './icono.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  