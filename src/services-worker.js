const CACHE_NAME = "";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/static/css/main.css",
  "/static/js/main.js",
  "/static/js/bundle.js",
  "/manifest.json",
  "/favicon.ico",
  "/logo_estetica.png",
  "/logo_estetica192.png",
  "/logo_estetica512.png",
  "/logo.ico",
  "/logo192.png",
  "/logo512.png",
  "/robots.txt"
];

// Instala y guarda archivos en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activa y elimina cachés antiguos si es necesario
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta las solicitudes y responde desde la caché o red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return caches.match("/index.html"); // Página de fallback si no hay conexión
        })
      );
    })
  );
});
