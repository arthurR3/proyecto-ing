// src/components/LoadingSpinner.js
import React from 'react';
import '../../CSS/LoadingSpinner.css'
const LoadingSpinner = () => {
  return (
    <div className="h-screen bg-white">
      <div className="flex justify-center items-center h-full">
        <img className="h-16 w-16" src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt=""/>
        <span className="mt-2 text-lg text-gray-500">Cargando...</span>

      </div>
    </div>
  );
};

export default LoadingSpinner;
