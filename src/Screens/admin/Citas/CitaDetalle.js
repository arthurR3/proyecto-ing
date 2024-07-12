import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiConnection from '../../../Componentes/Api/ApiConfig.js';
import axios from 'axios';

const URLConnetion = ApiConnection();

const CitaDetalle = () => {
  const { id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${URLConnetion}/dates/${id}`);
        const data = response.data;
        const now = new Date();
        // Filtra las citas agendadas y anteriores
        setAppointments(data.filter(appointment => new Date(appointment.date) >= now));
        setPreviousAppointments(data.filter(appointment => new Date(appointment.date) < now));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [id]);

  const cliente = appointments.length > 0 ? appointments[0].Usuario : {};

  return (
    <div className="container py-5">
      <div className="card shadow-sm mb-4">
        <div className="card-header text-black ">
          <h5 className="mb-0">Información del Cliente</h5>
        </div>
        <div className="card-body">
          {cliente && (
            <div className="d-flex align-items-center">
              <img
                src={cliente.image || 'https://cdn-icons-png.flaticon.com/512/11540/11540172.png'}
                alt={`${cliente.name} ${cliente.last_name1}`}
                className="rounded-circle me-5"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <div>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <h6 className="mb-1"><strong>Cliente:</strong></h6>
                    <p className="text-muted">{cliente.name} {cliente.last_name1} {cliente.last_name2}</p>
                  </li>
                  <li className="mb-3">
                    <h6 className="mb-1"><strong>Teléfono:</strong></h6>
                    <p className="text-muted">{cliente.phone}</p>
                  </li>
                  <li className="mb-3">
                    <h6 className="mb-1"><strong>Correo:</strong></h6>
                    <p className="text-muted">{cliente.email}</p>
                  </li>
                </ul>
              </div>
            </div>
              )}
        </div>
      </div>
        <div className="mb-4">
          <h4 className="title">Citas Agendadas</h4>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Precio</th>
                <th>Pagado</th>
                <th>Restante</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(cita => (
                <tr key={cita.id}>
                  <td>{cita.id}</td>
                  <td>{cita.date.split('T')[0]}</td>
                  <td>{cita.time}</td>
                  <td>{cita.Servicio.name}</td>
                  <td>${cita.Servicio.price}</td>
                  <td>${cita.paid}</td>
                  <td>${cita.remaining}</td>
                  <td>{cita.date_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="title">Citas Anteriores</h4>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Precio</th>
                <th>Pagado</th>
                <th>Restante</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {previousAppointments.map(cita => (
                <tr key={cita.id}>
                  <td>{cita.id}</td>
                  <td>{cita.date.split('T')[0]}</td>
                  <td>{cita.time}</td>
                  <td>{cita.Servicio.name}</td>
                  <td>${cita.Servicio.price}</td>
                  <td>${cita.paid}</td>
                  <td>${cita.remaining}</td>
                  <td>{cita.date_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      );
};

      export default CitaDetalle;
