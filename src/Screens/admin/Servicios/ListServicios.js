import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConnection from '../../../Componentes/Api/ApiConfig.js';
import ServiceForm from './FormServicios.js';
import LoadingSpinner from '../../../Componentes/Loading/Loading.js'
import exportToExcel from '../../../Componentes/Export_reportes/Export_excel.js';
const URLConnetion = ApiConnection();

const ListServicios = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileName = "Clientes";

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${URLConnetion}/services`);
      setServices(response.data);
    } catch (error) {
      console.log('Error getting services')
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  };

  const handleStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(`${URLConnetion}/services/${id}/`, { status });
      setServices(services.map(service => service.id === id ? { ...service, status } : service))
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }


  return (
    <div className="container py-5 mt-5">
      {isEditing ? (
        <ServiceForm service={selectedService} onSave={() => { setSelectedService(null); setIsEditing(false); fetchServices(); }} onCancel={() => { setSelectedService(null); setIsEditing(false) }} />
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className='col-md-offset-1 col-md-12'>
            <div className='panel'>
              <div className='panel-heading'>
                <div className='row d-flex'>
                  <div className='col'>
                    <h4 className='title'>Lista de Servicios</h4>
                  </div>
                  <div className='col text-right d-flex mb-3 justify-content-between'>
                    <div className='btn-group'>
                      <input type='text' className='form-control' placeholder='Search' />
                      <button className='btn btn-default' title='Reload' onClick={() => fetchServices()} ><i className='fa fa-sync-alt'></i></button>
                      <button className='btn btn-default' title='Descargar Excel' onClick={() => exportToExcel(services, fileName)}><i className='fa fa-file-excel'></i></button>
                      <button className="btn btn-default" onClick={() => { setSelectedService(null); setIsEditing(true); }}><i className="fa-solid fa-plus"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='panle-body table-responsive'>
          <table className="table align-items-center table-flush">            
            <thead className='thead-dark'>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Duración</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td><img src={service.image} alt={service.name} width="50" /></td>
                  <td>{service.name}</td>
                  <td>{service.Categoria.name}</td>
                  <td>{service.description}</td>
                  <td>${service.price.toFixed(2)}</td>
                  <td>{service.duration}</td>
                  <td>
                    {service.status ? 'Activo' : 'Deshabilitado'}
                  </td>
                  <td>
                    <div className="d-flex align-items-center m-2">
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setSelectedService(service);
                          setIsEditing(true);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square me-1"></i>
                        Editar
                      </button>
                      {service.status ? (
                        <button
                          className="btn btn-sm btn-secondary"
                          title="Desactivar servicio"
                          onClick={() => handleStatus(service.id, false)}
                        >
                          <i className="fa fa-eye-slash me-1"></i>
                          Desactivar
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          title="Activar servicio"
                          onClick={() => handleStatus(service.id, true)}
                        >
                          <i className="fa fa-eye me-1"></i>
                          Activar
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ListServicios;
