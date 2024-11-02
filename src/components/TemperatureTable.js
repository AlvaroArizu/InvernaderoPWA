// src/components/TemperatureTable.js
import React, { useState, useEffect } from 'react';
import '../styles/SeasonsTable.css'; // Asegúrate de que el archivo CSS tenga el estilo adecuado
import { useNavigate } from 'react-router-dom';

function TemperatureTable() {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minTemp, setMinTemp] = useState('');
  const [maxTemp, setMaxTemp] = useState('');
  const [minHumidity, setMinHumidity] = useState('');
  const [maxHumidity, setMaxHumidity] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch('http://localhost/getData.php?table=temperature')
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

  // Filtrar datos por rango de fechas, temperatura y humedad
  useEffect(() => {
    let filtered = data;

    // Filtro de rango de fechas
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(`${item.year}-${item.month}-${item.day}`);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    // Filtro de rango de temperatura
    if (minTemp && maxTemp) {
      filtered = filtered.filter(
        (item) => item.degrees >= minTemp && item.degrees <= maxTemp
      );
    }

    // Filtro de rango de humedad
    if (minHumidity && maxHumidity) {
      filtered = filtered.filter(
        (item) =>
          item.humidity >= minHumidity && item.humidity <= maxHumidity
      );
    }

    setFilteredData(filtered);
  }, [startDate, endDate, minTemp, maxTemp, minHumidity, maxHumidity, data]);

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
    <div className="container mt-4">
      <h2 className="text-center mb-4">Temperatura</h2>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label>Fecha de inicio:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Fecha de fin:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Temp Mínima:</label>
          <input
            type="number"
            className="form-control"
            placeholder="Mínima"
            value={minTemp}
            onChange={(e) => setMinTemp(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Temp Máxima:</label>
          <input
            type="number"
            className="form-control"
            placeholder="Máxima"
            value={maxTemp}
            onChange={(e) => setMaxTemp(e.target.value)}
          />
        </div>
        <div className="col-md-3 mt-3">
          <label>Humedad Mínima:</label>
          <input
            type="number"
            className="form-control"
            placeholder="Mínima"
            value={minHumidity}
            onChange={(e) => setMinHumidity(e.target.value)}
          />
        </div>
        <div className="col-md-3 mt-3">
          <label>Humedad Máxima:</label>
          <input
            type="number"
            className="form-control"
            placeholder="Máxima"
            value={maxHumidity}
            onChange={(e) => setMaxHumidity(e.target.value)}
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
            <th onClick={() => handleSort('degrees')} style={{ cursor: 'pointer' }}>
              Grados {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th>Día</th>
            <th>Mes</th>
            <th>Año</th>
            <th onClick={() => handleSort('hour')} style={{ cursor: 'pointer' }}>
              Hora {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th>Minutos</th>
            <th>Segundos</th>
            <th onClick={() => handleSort('humidity')} style={{ cursor: 'pointer' }}>
              Humedad {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.degrees}</td>
              <td>{row.day}</td>
              <td>{row.month}</td>
              <td>{row.year}</td>
              <td>{row.hour}</td>
              <td>{row.minutes}</td>
              <td>{row.seconds}</td>
              <td>{row.humidity}</td>
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

export default TemperatureTable;


