import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ManualActionsTable from './components/ManualActionsTable';
import SeasonsTable from './components/SeasonsTable';
import SystemEventsTable from './components/SystemEventsTable';
import TemperatureTable from './components/TemperatureTable';
import WindowsTable from './components/WindowsTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App1.css'; 

function App() {
  const [lastNotificationId, setLastNotificationId] = useState(null);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        console.log("Permiso de notificación:", permission);
      });
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost/getData.php?table=notifications&latest=true');
        const data = await response.json();
        console.log("Datos de notificación:", data);

        if (data.length > 0) {
          const latestNotification = data[0];
          if (latestNotification.id !== lastNotificationId) {
            showNotification(latestNotification.action);
            setLastNotificationId(latestNotification.id);
          }
        }
      } catch (error) {
        console.error('Error al obtener la notificación:', error);
      }
    };

    const showNotification = (action) => {
      if (Notification.permission === 'granted') {
        new Notification('Cambio en Estado de Ventana', {
          body: action,
          icon: '/icon.png',
        });
      }
    };

    const intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, [lastNotificationId]);

  return (
    <Router>
      <div className="App bg-light min-vh-100 d-flex flex-column">
        <Navbar />
        <header className="app-header text-center py-4">
          <h1>Sistema de Monitoreo del Invernadero</h1>
          <p>Supervisa y gestiona todas las métricas de tu invernadero de forma eficiente.</p>
        </header>

        <main className="container my-4 flex-grow-1">
          <Routes>
            <Route
              path="/"
              element={
                <div className="text-center">
                  <h2 className="my-4">Bienvenido al Sistema de Invernadero</h2>
                  <p className="text-muted">
                    Selecciona una de las opciones del menú para ver las métricas y eventos de tu invernadero.
                  </p>
                  <div className="btn-group-container mt-4">
                    <Link to="/manual-actions" className="btn custom-btn-primary">
                      Acciones Manuales
                    </Link>
                    <Link to="/seasons" className="btn custom-btn-secondary">
                      Estaciones
                    </Link>
                    <Link to="/system-events" className="btn custom-btn-success">
                      Eventos del Sistema
                    </Link>
                    <Link to="/temperature" className="btn custom-btn-danger">
                      Temperatura
                    </Link>
                    <Link to="/windows" className="btn custom-btn-info">
                      Estado de Ventanas
                    </Link>
                  </div>
                </div>
              }
            />
            <Route
              path="/manual-actions"
              element={
                <div className="card custom-card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">Acciones Manuales</h3>
                    <p className="card-text">Consulta todas las acciones manuales registradas en el sistema.</p>
                    <ManualActionsTable />
                  </div>
                </div>
              }
            />
            <Route
              path="/seasons"
              element={
                <div className="card custom-card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">Estaciones</h3>
                    <p className="card-text">Consulta las estaciones y condiciones climáticas predefinidas.</p>
                    <SeasonsTable />
                  </div>
                </div>
              }
            />
            <Route
              path="/system-events"
              element={
                <div className="card custom-card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">Eventos del Sistema</h3>
                    <p className="card-text">Revisa los eventos del sistema registrados automáticamente.</p>
                    <SystemEventsTable />
                  </div>
                </div>
              }
            />
            <Route
              path="/temperature"
              element={
                <div className="card custom-card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">Temperatura</h3>
                    <p className="card-text">Monitorea los registros de temperatura en el tiempo.</p>
                    <TemperatureTable />
                  </div>
                </div>
              }
            />
            <Route
              path="/windows"
              element={
                <div className="card custom-card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">Estado de Ventanas</h3>
                    <p className="card-text">Consulta el estado de las ventanas a lo largo del tiempo.</p>
                    <WindowsTable />
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <footer className="app-footer text-center py-3 mt-auto">
          <p className="mb-0">&copy; 2024 Sistema de Monitoreo del Invernadero. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
