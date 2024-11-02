import React, { useState, useEffect } from 'react';
import '../styles/WindowsTable.css';
import { useNavigate } from 'react-router-dom';

function WindowsTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [stateFilter, setStateFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch('http://localhost/getData.php?table=windows')
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

    if (stateFilter) {
      filtered = filtered.filter((item) =>
        item.state.toLowerCase() === stateFilter.toLowerCase()
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(`${item.year}-${item.month}-${item.day}`);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    setFilteredData(filtered);
  }, [stateFilter, startDate, endDate, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="windows-container mt-4">
      <h2 className="windows-title text-center mb-4">Estado de Ventanas</h2>

      {/* Filtros */}
      <div className="windows-filter-container mb-3">
        <div>
          <label>Estado de la ventana:</label>
          <select
            className="windows-select"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Opened">Abierta</option>
            <option value="Closed">Cerrada</option>
          </select>
        </div>
        <div>
          <label>Fecha de inicio:</label>
          <input
            type="date"
            className="windows-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>Fecha de fin:</label>
          <input
            type="date"
            className="windows-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Tarjetas de datos */}
      <div className="windows-card-container">
        {currentItems.map((row) => (
          <div className="windows-card" key={row.id}>
            <h5 className="windows-card-title">Registro ID: {row.id}</h5>
            <p><strong>Estado:</strong> {row.state}</p>
            <p><strong>Fecha:</strong> {`${row.day}-${row.month}-${row.year}`}</p>
            <p><strong>Hora:</strong> {`${row.hour}:${row.minutes}:${row.seconds}`}</p>
          </div>
        ))}
      </div>
      
      {error && <p className="windows-error-message mt-3">{error}</p>}

      {/* Paginación */}
      <div className="windows-pagination-container mt-4">
        <span>Página {currentPage} de {totalPages}</span>
        <button
          className="windows-pagination-btn btn btn-primary btn-sm me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        <button
          className="windows-pagination-btn btn btn-primary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>


      {/* Botón para volver atrás */}
      <div className="windows-back-btn-container mt-4">
        <button
          className="windows-back-btn btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default WindowsTable;



