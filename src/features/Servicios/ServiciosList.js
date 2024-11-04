// src/components/ServiceList.js
import React, { useState, useEffect } from 'react';
import ServiceCard from '../../Components/Servicios/ServicesCard.js'; // Asegúrate de ajustar el camino según tu estructura de carpetas
import LoadingSpinner from '../../Components/Loading/Loading.js';
import axios from 'axios';
import ApiConnection from '../../Components/Api/ApiConfig.js';

const ServiceList = () => {
  const URLConnetion = ApiConnection()
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
        try {
            const response = await axios.get(`${URLConnetion}/services`);
            setServices(response.data.filter(service => service.status === true).slice(0,9));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    loadServices();
}, []);

  if(loading){
    return <LoadingSpinner/>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} showDetails={false} />
      ))}
    </div>
  );
};

export default ServiceList;
