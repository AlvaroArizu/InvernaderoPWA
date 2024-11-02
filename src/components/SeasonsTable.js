import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SeasonsTable.css';

function SeasonsTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Obtener datos de la API
  useEffect(() => {
    fetch('http://localhost/getData.php?table=seasons')
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

  // Filtro de búsqueda
  useEffect(() => {
    let filtered = data;

    if (search) {
      filtered = filtered.filter((item) =>
        item.season_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        (item) => item.start_date >= startDate && item.end_date <= endDate
      );
    }

    setFilteredData(filtered);
  }, [search, startDate, endDate, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="container2 mt-4">
      <h2 className="text-center mb-4">Estaciones</h2>

      {/* Filtros */}
      <div className="filter-container mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Buscar estación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="form-control mb-2"
          placeholder="Fecha de inicio"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="form-control mb-2"
          placeholder="Fecha de fin"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Tarjetas de datos */}
      <div className="card-container">
        {currentItems.map((row) => (
          <div className="card" key={row.id}>
            <h5>Estación: {row.season_name}</h5>
            <p><strong>ID:</strong> {row.id}</p>
            <p><strong>Temp Min:</strong> {row.temp_min}°C</p>
            <p><strong>Temp Max:</strong> {row.temp_max}°C</p>
            <p><strong>Fecha Inicio:</strong> {row.start_date}</p>
            <p><strong>Fecha Fin:</strong> {row.end_date}</p>
            <p><strong>Última Modificación:</strong> {row.last_modified}</p>
          </div>
        ))}
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}

      {/* Paginación */}
      <div className="pagination-container">
        <span>Página {currentPage} de {totalPages}</span>
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        <button
          className="btn btn-primary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>

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

export default SeasonsTable;
