import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importación de Bootstrap CSS
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registrar el Service Worker para funcionamiento offline
serviceWorkerRegistration.register();

// Para medir el rendimiento de la aplicación
reportWebVitals();

// Función para verificar nuevas notificaciones cada cierto tiempo
function checkForNewNotifications() {
    setInterval(async () => {
        try {
            const response = await fetch('https://springgreen-worm-743165.hostingersite.com/backend/check-new-notifications.php');
            const data = await response.json();

            if (data && data.id) {
                // Si hay una nueva notificación, muestra una en el navegador
                showNotification(data);
            }
        } catch (error) {
            console.error('Error al verificar nuevas notificaciones:', error);
        }
    }, 10000); // Consulta cada 10 segundos
}

// Función para mostrar la notificación usando la Notification API
function showNotification(data) {
    if (Notification.permission === 'granted') {
        new Notification(data.action, {
            body: `Fecha: ${data.action_date} Hora: ${data.action_time}`,
            icon: '/icon.png' // Asegúrate de tener este icono en la carpeta `public`
        });
    }
}

// Solicitar permiso para mostrar notificaciones cuando se carga la página
if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            checkForNewNotifications();
        }
    });
} else if (Notification.permission === 'granted') {
    checkForNewNotifications();
}

