module.exports = {
    globDirectory: "build/",
    globPatterns: [
      "**/*.{html,js,css,png,jpg,json,ico}"
    ],
    swDest: "build/service-worker.js",
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
        urlPattern: /https:\/\/back-estetica-production-e475\.up\.railway\.app\/products/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'products',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 5 * 60, // 5 minutos
          },
        },
      },
      {
        urlPattern: /https:\/\/back-estetica-production-e475\.up\.railway\.app\/services/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'services',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 5 * 60, // 5 minutos
          },
        },
      },
      {
        urlPattern: /https:\/\/back-estetica-production-e475\.up\.railway\.app\/users\/\d+/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'user-detail',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 5 * 60, // 5 minutos
          },
        },
      },
    ],
  };
  