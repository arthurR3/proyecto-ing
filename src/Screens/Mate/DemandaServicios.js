import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useParams } from 'react-router-dom';

const DemandaEstetica = () => {
  const { numCitas, serviceName } = useParams();
  const [valorInicial, setValorInicial] = useState(parseInt(numCitas));
  const [tiempoInicial, setTiempoInicial] = useState('2024-01-12');
  const [valorK, setValorK] = useState(null);
  const [tiempoK, setTiempoK] = useState(null);
  const [kCalculado, setKCalculado] = useState('');
  const [resultado, setResultado] = useState('');
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  const fechas = [
    { date: new Date('2024-01-12'), label: 'Elige una fecha' },
    { date: new Date('2024-01-26'), label: '26 de enero del 2024' },
    { date: new Date('2024-02-02'), label: '02 de febrero del 2024' },
    { date: new Date('2024-02-09'), label: '09 de febrero del 2024' },
    { date: new Date('2024-02-16'), label: '16 de febrero del 2024' },
    { date: new Date('2024-02-23'), label: '23 de febrero del 2024' },
    { date: new Date('2024-03-01'), label: '01 de marzo del 2024' },
    { date: new Date('2024-03-08'), label: '08 de marzo del 2024' },
    { date: new Date('2024-03-15'), label: '15 de marzo del 2024' },
    { date: new Date('2024-03-22'), label: '22 de marzo del 2024' },
    { date: new Date('2024-03-29'), label: '29 de marzo del 2024' },
  ];

  const calcularK = () => {
    const demandaInicialNum = parseFloat(valorInicial);
    const demandaDeseadaNum = parseFloat(valorK);
    const kCalculado = Math.log(demandaDeseadaNum / demandaInicialNum);

    setKCalculado(kCalculado.toFixed(4));
  };

  const calcularDemanda = () => {
    const valorInicialNum = parseFloat(valorInicial);
    const tiempoDeseadoNum = parseFloat(tiempoK);
    const k = parseFloat(kCalculado);

    const demandaCalculada = valorInicialNum * Math.exp(k * (tiempoDeseadoNum - 1));
    setResultado(demandaCalculada.toFixed(1));

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const demandaData = [];
      for (let i = 1; i <= tiempoDeseadoNum; i++) {
        demandaData.push({
          x: i,
          y: valorInicialNum * Math.exp(k * (i ===1? i:i - 1)),
        });
      }

      const newChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: 'semanas',
          datasets: [
            {
              label: 'Demandas',
              data: demandaData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Tiempo (semanas)',
              },
              beginAtZero: true,
            },
            y: {
              title: {
                display: true,
                text: 'Demanda',
              },
              beginAtZero: true,
            },
          },
        },
      });

      setChartInstance(newChartInstance);
    }
  };

  return (
    <div className="container mt-4 py-4">
      <h1>Demanda de Servicios en la Estética</h1>
      <div className="row mb-3">
        <label htmlFor="categoria" className="col-sm-2 col-form-label fw-bold">Servicio {serviceName}</label>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label>Demanda inicial:</label>
          <input
            type="number"
            className="form-control"
            value={valorInicial}
            onChange={(e) => setValorInicial(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label>Tiempo:</label>
          <input
            type="text"
            className="form-control"
            value={tiempoInicial}
            onChange={(e) => setTiempoInicial(e.target.value)}
          />
        </div>
        <div>
          Valores de K
        </div>
        <div className="col-md-6">
          <label>Demanda:</label>
          <input
            type="number"
            className="form-control"
            value={valorK}
            onChange={(e) => setValorK(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label>Tiempo:</label>
          <select
            className="form-control"
            value={tiempoK}
            onChange={(e) => setTiempoK(e.target.value)}
          >
            {fechas.map((fecha, index) => (
              <option key={index} value={index}>
                {fecha.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={() => { calcularK(); calcularDemanda(); }} className='btn'>Calcular Demanda</button>
          {resultado && (
            <div>
              <p>Resultado: {resultado} servicios en {tiempoK - 1} semanas</p>
              <div>
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandaEstetica;
