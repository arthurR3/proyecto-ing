module.exports = {
  globDirectory: "build/",
  globPatterns: [
      "**/*.{html,js,css,png,jpg,json,ico}"
  ],
  swDest: "build/service-worker.js",
   // Agregar un manejo personalizado de eventos (como 'push')
   importScripts: [
    '/cw.js'  // Asegúrate de que la ruta sea correcta
  ],

  runtimeCaching: [
      {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: "CacheFirst",
          options: {
              cacheName: "images-cache",
              expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
          },
      },
      {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
              cacheName: 'static-resources',
              expiration: {
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
              },
          },
      },
      {
          urlPattern: /https:\/\/back-estetica-production-e475\.up\.railway\.app\/api\/v1\/products/,
          handler: 'NetworkFirst', // Cambia esto a CacheFirst si quieres acceso offline más confiable
          options: {
              cacheName: 'products',
              expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 5 * 60, // 5 minutos
              },
              networkTimeoutSeconds: 5, // Tiempo para esperar la respuesta antes de usar la caché
          },
      },
      {
          urlPattern: /https:\/\/back-estetica-production-e475\.up\.railway\.app\/api\/v1\/services/,
          handler: 'NetworkFirst', // Cambia esto a CacheFirst si quieres acceso offline más confiable
          options: {
              cacheName: 'services',
              expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 5 * 60, // 5 minutos
              },
              networkTimeoutSeconds: 5, // Tiempo para esperar la respuesta antes de usar la caché
          },
      },
      {
          urlPattern: /https:\/\/back-estetica-production-e475\.up\.railway\.app\/api\/v1\/users\/\d+/,
          handler: 'NetworkFirst', // Cambia esto a CacheFirst si quieres acceso offline más confiable
          options: {
              cacheName: 'user-detail',
              expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 5 * 60, // 5 minutos
              },
              networkTimeoutSeconds: 5, // Tiempo para esperar la respuesta antes de usar la caché
          },
      },
      {
        urlPattern: /https:\/\/back-estetica-production-e475\.up\.railway\.app\/api\/v1\/dates\/\d+/,
        handler: 'NetworkFirst', // Cambia esto a CacheFirst si quieres acceso offline más confiable
        options: {
            cacheName: 'dates-user',
            expiration: {
                maxEntries: 10,
                maxAgeSeconds: 5 * 60, // 5 minutos
            },
            networkTimeoutSeconds: 5, // Tiempo para esperar la respuesta antes de usar la caché
        },
    },
    {
        urlPattern: /https:\/\/back-estetica-production-e475\.up\.railway\.app\/api\/v1\/sales\/\d+/,
        handler: 'NetworkFirst', // Cambia esto a CacheFirst si quieres acceso offline más confiable
        options: {
            cacheName: 'sales-user',
            expiration: {
                maxEntries: 10,
                maxAgeSeconds: 5 * 60, // 5 minutos
            },
            networkTimeoutSeconds: 5, // Tiempo para esperar la respuesta antes de usar la caché
        },
    },
  ],
};
