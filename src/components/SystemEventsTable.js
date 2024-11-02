// src/components/SystemEventsTable.js
import React, { useState, useEffect } from 'react';
import '../styles/ManualActionsTable.css';
import { useNavigate } from 'react-router-dom';

function SystemEventsTable() {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch('http://localhost/getData.php?table=system_events')
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

  // Filtrar datos por búsqueda y rango de fechas
  useEffect(() => {
    let filtered = data;

    // Filtro de búsqueda por descripción de evento
    if (search) {
      filtered = filtered.filter((item) =>
        item.action.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro de rango de fechas
    if (startDate && endDate) {
      filtered = filtered.filter(
        (item) => item.action_date >= startDate && item.action_date <= endDate
      );
    }

    setFilteredData(filtered);
  }, [search, startDate, endDate, data]);

  // Ordenar datos
  const handleSort = (column) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="container2 mt-4">
      <h2 className="text-center mb-4">Eventos del Sistema</h2>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar evento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            placeholder="Fecha de inicio"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            placeholder="Fecha de fin"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de datos */}
      <table className="table table-striped table-responsive">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
              ID {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th>Descripción del Evento</th>
            <th onClick={() => handleSort('action_date')} style={{ cursor: 'pointer' }}>
              Fecha {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('action_time')} style={{ cursor: 'pointer' }}>
              Hora {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.action}</td>
              <td>{row.action_date}</td>
              <td>{row.action_time}</td>
            </tr>
          ))}
        </tbody>
      </table>



      {/* Paginación */}
      <div className="d-flex justify-content-between align-items-center">
        <span>Página {currentPage} de {totalPages}</span>
        <div>
          <button
            className="btn btn-primary btn-sm me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <button
            className="btn btn-primary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}
            {/* Botón para volver atrás */}
            <div className="text-center mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)} // Vuelve a la página anterior
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default SystemEventsTable;
