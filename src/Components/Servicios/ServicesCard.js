// src/components/ServiceCard.js
import React from 'react';
import { Button } from 'primereact/button';

const formatDuration = (duration) => {
  const [hours, minutes] = duration.split(':');
  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);
  let formatted = '';
  if (h > 0) {
    formatted += `${h}h`;
  }
  if (m > 0) {
    formatted += ` ${m}min`;
  }
  return formatted.trim();
};

const ServiceCard = ({ service, showDetails = true, onClick }) => {
  return (
    <div
      className={`bg-white p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
    >
      {showDetails && (
        <>

          <div className="relative flex justify-center items-center mb-4 h-auto bg-muted rounded-full">
            <img
              src={service.image}
              alt="Service Image"
              width={100}
              height={100}
              className="rounded-full"
              style={{ aspectRatio: "100/100", objectFit: "cover" }}
            />
          </div>
          <h3 className="text-2xl font-bold text-purple-600 mb-2">{service.name}</h3>
          <p className="text-muted-foreground mb-4">{service.description}</p>
          <div className="flex items-center justify-between mb-7">
            <div className=" font-semibold"><p className='text-gray-500'>Costo:</p> ${service.price.toFixed(2)}</div>
            <div className='font-semibold'><p className='text-gray-500'>Duración:</p> {formatDuration(service.duration)}</div>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-200 flex justify-start">
        <Button 
          severity="success" 
          label="Reserva Ya!" 
          className="text-white bg-green-500 hover:bg-green-600"
          onClick={onClick} 
        />
      </div>
        </>
      )}
      {!showDetails && (
        <>
          <h3 className="text-xl font-semibold  text-purple-600 mb-2">{service.name}</h3>
          <p className="text-gray-400">{service.description}</p>
        </>
      )}
    </div>
  );
};

export default ServiceCard;
