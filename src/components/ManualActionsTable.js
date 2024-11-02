import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ManualActionsTable.css';

function ManualActionsTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch('https://springgreen-worm-743165.hostingersite.com/backend/getData.php?table=manual_actions') // Cambia aquí a la URL de producción
      .then((response) => {
        if (!response.ok) throw new Error('Error en la respuesta de la API');
        return response.json();
      })
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter((item) =>
        item.action.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (startDate && endDate) {
      filtered = filtered.filter(
        (item) => item.action_date >= startDate && item.action_date <= endDate
      );
    }
    setFilteredData(filtered);
  }, [search, startDate, endDate, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="manual-actions-container mt-4">
      <h2 className="manual-actions-title text-center mb-4">Acciones Manuales</h2>

      {/* Filtros */}
      <div className="manual-actions-filter-container mb-4">
        <input
          type="text"
          className="manual-actions-input"
          placeholder="Buscar acción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="manual-actions-input"
          placeholder="Fecha de inicio"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="manual-actions-input"
          placeholder="Fecha de fin"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Tarjetas de datos */}
      <div className="manual-actions-card-container">
        {currentItems.map((row) => (
          <div className="manual-actions-card" key={row.id}>
            <h5 className="manual-actions-card-title">Registro ID: {row.id}</h5>
            <p><strong>Acción:</strong> {row.action}</p>
            <p><strong>Fecha:</strong> {row.action_date}</p>
            <p><strong>Hora:</strong> {row.action_time}</p>
          </div>
        ))}
      </div>
      {error && <p className="manual-actions-error-message mt-3">{error}</p>}

      {/* Paginación */}
      <div className="manual-actions-pagination-container mt-4">
        <span>Página {currentPage} de {totalPages}</span>
        <button
          className="manual-actions-pagination-btn btn btn-outline-primary btn-sm me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        <button
          className="manual-actions-pagination-btn btn btn-outline-primary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>

      {/* Botón para volver atrás */}
      <div className="manual-actions-back-btn-container text-center mt-4">
        <button
          className="manual-actions-back-btn btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default ManualActionsTable;




