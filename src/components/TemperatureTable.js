import React, { useState, useEffect } from 'react';
import '../styles/TemperatureTable.css';
import { useNavigate } from 'react-router-dom';

function TemperatureTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minTemp, setMinTemp] = useState('');
  const [maxTemp, setMaxTemp] = useState('');
  const [minHumidity, setMinHumidity] = useState('');
  const [maxHumidity, setMaxHumidity] = useState('');
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

  useEffect(() => {
    let filtered = data;

    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(`${item.year}-${item.month}-${item.day}`);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    if (minTemp && maxTemp) {
      filtered = filtered.filter(
        (item) => item.degrees >= minTemp && item.degrees <= maxTemp
      );
    }

    if (minHumidity && maxHumidity) {
      filtered = filtered.filter(
        (item) => item.humidity >= minHumidity && item.humidity <= maxHumidity
      );
    }

    setFilteredData(filtered);
  }, [startDate, endDate, minTemp, maxTemp, minHumidity, maxHumidity, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="temperature-container mt-4">
      <h2 className="temperature-title text-center mb-4">Registros de Temperatura</h2>

      {/* Filtros */}
      <div className="temperature-filter-container mb-3">
        <div>
          <label>Fecha de inicio:</label>
          <input
            type="date"
            className="temperature-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>Fecha de fin:</label>
          <input
            type="date"
            className="temperature-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label>Temp Mínima:</label>
          <input
            type="number"
            className="temperature-input"
            placeholder="Mínima"
            value={minTemp}
            onChange={(e) => setMinTemp(e.target.value)}
          />
        </div>
        <div>
          <label>Temp Máxima:</label>
          <input
            type="number"
            className="temperature-input"
            placeholder="Máxima"
            value={maxTemp}
            onChange={(e) => setMaxTemp(e.target.value)}
          />
        </div>
        <div>
          <label>Humedad Mínima:</label>
          <input
            type="number"
            className="temperature-input"
            placeholder="Mínima"
            value={minHumidity}
            onChange={(e) => setMinHumidity(e.target.value)}
          />
        </div>
        <div>
          <label>Humedad Máxima:</label>
          <input
            type="number"
            className="temperature-input"
            placeholder="Máxima"
            value={maxHumidity}
            onChange={(e) => setMaxHumidity(e.target.value)}
          />
        </div>
      </div>

      {/* Tarjetas de datos */}
      <div className="temperature-card-container">
        {currentItems.map((row) => (
          <div className="temperature-card" key={row.id}>
            <h5 className="temperature-card-title">Registro ID: {row.id}</h5>
            <p><strong>Grados:</strong> {row.degrees}°C</p>
            <p><strong>Fecha:</strong> {`${row.day}-${row.month}-${row.year}`}</p>
            <p><strong>Hora:</strong> {`${row.hour}:${row.minutes}:${row.seconds}`}</p>
            <p><strong>Humedad:</strong> {row.humidity}%</p>
          </div>
        ))}
      </div>
      
      {error && <p className="temperature-error-message mt-3">{error}</p>}

      {/* Paginación */}
      <div className="temperature-pagination-container">
        <span>Página {currentPage} de {totalPages}</span>
        <button
          className="temperature-pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        <button
          className="temperature-pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>


      {/* Botón para volver atrás */}
      <div className="temperature-back-btn-container mt-4">
        <button
          className="temperature-back-btn"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default TemperatureTable;



