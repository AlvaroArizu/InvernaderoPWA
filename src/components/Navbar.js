import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faCalendarAlt, faThermometerHalf, faWindowRestore, faCogs } from '@fortawesome/free-solid-svg-icons';
import '../styles/Navbar.css'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la apertura del menú

  const toggleNavbar = () => {
    setIsOpen(!isOpen); // Cambia el estado al hacer clic en el botón de menú
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <FontAwesomeIcon icon={faLeaf} className="me-2" />
          Invernadero
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/manual-actions" activeClassName="active">
                <FontAwesomeIcon icon={faCogs} className="me-1" />
                Acciones Manuales
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/seasons" activeClassName="active">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                Estaciones
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/system-events" activeClassName="active">
                <FontAwesomeIcon icon={faLeaf} className="me-1" />
                Eventos del Sistema
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/temperature" activeClassName="active">
                <FontAwesomeIcon icon={faThermometerHalf} className="me-1" />
                Temperatura
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/windows" activeClassName="active">
                <FontAwesomeIcon icon={faWindowRestore} className="me-1" />
                Estado de Ventanas
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


