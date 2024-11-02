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
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="container3 mt-4">
      <h2 className="text-center mb-4">Estaciones</h2>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar estación..."
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
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} className="sortable">
              ID {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th>Estación</th>
            <th onClick={() => handleSort('temp_min')} className="sortable">
              Temp Min {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('temp_max')} className="sortable">
              Temp Max {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('start_date')} className="sortable">
              Fecha Inicio {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('end_date')} className="sortable">
              Fecha Fin {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('last_modified')} className="sortable">
              Última Modificación {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.season_name}</td>
              <td>{row.temp_min}</td>
              <td>{row.temp_max}</td>
              <td>{row.start_date}</td>
              <td>{row.end_date}</td>
              <td>{row.last_modified}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="d-flex justify-content-between align-items-center mb-4">
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

export default SeasonsTable;
