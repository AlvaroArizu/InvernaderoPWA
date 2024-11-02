/* eslint-disable no-restricted-globals */

// Importa los módulos necesarios de Workbox para mejorar el caching y el manejo de recursos
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precacha todos los assets generados por el proceso de construcción.
// Las URLs se inyectan en la variable `self.__WB_MANIFEST` durante el proceso de compilación.
// Este precaching asegura que los archivos críticos estén disponibles sin conexión.
precacheAndRoute(self.__WB_MANIFEST);

// Configura el App Shell para manejar las solicitudes de navegación
// En una aplicación de página única (SPA), redirige todas las solicitudes de navegación al index.html
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    // Si la solicitud no es de navegación, omítela.
    if (request.mode !== 'navigate') {
      return false;
    }
    // Omite las URLs que comienzan con "/_".
    if (url.pathname.startsWith('/_')) {
      return false;
    }
    // Si parece una URL de recurso, porque contiene una extensión de archivo, omítela.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }
    // Usa el handler para todas las demás solicitudes de navegación.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Ruta de cacheo en tiempo de ejecución para solicitudes de imágenes PNG de mismo origen.
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Plugin para asegurar que una vez que el caché alcance un tamaño máximo,
      // las imágenes menos utilizadas se eliminen.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Permite a la aplicación web activar skipWaiting
// Para que la nueva versión del Service Worker tome control inmediatamente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Escuchar el evento 'push' para manejar las notificaciones push entrantes
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}; // Convierte los datos en JSON si existen
  const title = data.title || 'Notificación'; // Título de la notificación, o un valor por defecto
  const options = {
    body: data.body || 'Tienes una nueva notificación.', // Cuerpo de la notificación
    icon: data.icon || '/icon.png', // Ícono de la notificación
    badge: data.badge || '/badge.png', // Badge opcional de la notificación
  };

  // Muestra la notificación
  event.waitUntil(self.registration.showNotification(title, options));
});

// Escuchar el evento 'notificationclick' para manejar los clics en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Cierra la notificación al hacer clic

  // Abre la aplicación o enfoca la pestaña si ya está abierta
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
