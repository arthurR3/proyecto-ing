import React from 'react';
import '../../CSS/Carrusel.css'
const LoadingSpinner = () => {
  return (
    <div className="loading-spinner align-text-center">
      <svg width="80px" height="150px" viewBox="0 0 51 50">
        <rect y="0" width="13" height="50" fill="#990fbb">
          <animate attributeName="height" values="50;10;50" begin="0s" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" values="0;20;0" begin="0s" dur="1s" repeatCount="indefinite" />
        </rect>

        <rect x="19" y="0" width="13" height="50" fill="#7827e7">
          <animate attributeName="height" values="50;10;50" begin="0.2s" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" values="0;20;0" begin="0.2s" dur="1s" repeatCount="indefinite" />
        </rect>

        <rect x="38" y="0" width="13" height="50" fill="#88089b">
          <animate attributeName="height" values="50;10;50" begin="0.4s" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" values="0;20;0" begin="0.4s" dur="1s" repeatCount="indefinite" />
        </rect>
      </svg>
      <p className='loading-text'>Cargando...</p>
    </div>
  );
};


const Loading = () => {

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <LoadingSpinner/>
    </div>
  );
};

export default Loading;
