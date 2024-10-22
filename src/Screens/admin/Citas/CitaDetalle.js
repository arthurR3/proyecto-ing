import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiConnection from '../../../Componentes/Api/ApiConfig.js';
import axios from 'axios';
import LoadingSpinner from '../../../Componentes/Loading/Loading.js';
import { Button } from 'react-bootstrap';

const URLConnetion = ApiConnection();

const CitaDetalle = () => {
  const { id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [attendedAppointments, setAttendedAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [id]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URLConnetion}/dates/${id}`);
      const data = response.data;
      const now = new Date();

      // Filtra las citas agendadas y clasifica las anteriores
      setAppointments(data.filter(appointment => new Date(appointment.date) >= now));
      const previousAppointments = data.filter(appointment => new Date(appointment.date) < now);
      setAttendedAppointments(previousAppointments.filter(appointment => appointment.date_status === 'Atendida'));
      setPendingAppointments(previousAppointments.filter(appointment => appointment.date_status === 'P_Confirmar' || appointment.date_status === 'Confirmada' || appointment.date_status === 'pendiente'));
      setCanceledAppointments(previousAppointments.filter(appointment => appointment.date_status === 'Cancelada'));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cliente = appointments.length > 0 ? appointments[0].Usuario : {};

  const handleMarkAsAttended = async (appointmentId) => {
    setLoading(true);
    try {
        // Verifica si la cita está en estado 'Confirmada' antes de marcarla como atendida
        const appointment = appointments.find(cita => cita.id === appointmentId);
        if (appointment && appointment.date_status === 'Confirmada') {
            await axios.put(`${URLConnetion}/dates/${appointmentId}`, {
              date_status: 'Atendida'
            });
            fetchAppointments();
        } else {
            alert('La cita debe estar en estado Confirmada para ser marcada como Atendida.');
        }
    } catch (error) {
        console.error('Error marking appointment as attended:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    setLoading(true);
    try {
        await axios.put(`${URLConnetion}/dates/${appointmentId}`, {
          status: 'Cancelada'
        });
        fetchAppointments();
    } catch (error) {
        console.error('Error canceling appointment:', error);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-4 py-5">
      <h4 className="title">Citas Agendadas por usuario</h4>
      <hr />
      <div className="card shadow-sm mb-4">
        <div className="text-black">
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
        <h4 className="title">Citas Programadas</h4>
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Servicio</th>
              <th>Precio</th>
              <th>Pagado</th>
              <th>Restante</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(cita => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.date.split('T')[0]}</td>
                <td>{cita.time}</td>
                <td>{cita.Detalle_citas.map(detalle => (
                  <div key={detalle.id_service}>
                    {detalle.Servicio.name} - ${detalle.price} ({detalle.duration})
                  </div>
                ))}</td>
                <td>${cita.Detalle_citas.reduce((total, detalle) => total + detalle.price, 0)}</td>
                <td>${cita.paid}</td>
                <td>${cita.remaining}</td>
                <td>{cita.date_status}</td>
                <td>
                  {['Confirmada', 'P_Confirmar'].includes(cita.date_status) && (
                    <>
                      <Button 
                        variant="success" 
                        className='me-3' 
                        onClick={() => handleMarkAsAttended(cita.id)}
                        disabled={cita.date_status !== 'Confirmada'}
                      >
                        Marcar como Atendida
                      </Button>
                      <Button 
                        variant="danger" 
                        className='mt-3 me-3' 
                        onClick={() => handleCancelAppointment(cita.id)}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="title">Citas Anteriores</h4>
        
        <h5>Atendidas</h5>
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
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
            {attendedAppointments.map(cita => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.date.split('T')[0]}</td>
                <td>{cita.time}</td>
                <td>{cita.Detalle_citas.map(detalle => (
                  <div key={detalle.id_service}>
                    {detalle.Servicio.name} - ${detalle.price} ({detalle.duration})
                  </div>
                ))}</td>
                <td>${cita.Detalle_citas.reduce((total, detalle) => total + detalle.price, 0)}</td>
                <td>${cita.paid}</td>
                <td>${cita.remaining}</td>
                <td>{cita.date_status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <h5>Pendientes</h5>
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
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
            {pendingAppointments.map(cita => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.date.split('T')[0]}</td>
                <td>{cita.time}</td>
                <td>{cita.Detalle_citas.map(detalle => (
                  <div key={detalle.id_service}>
                    {detalle.Servicio.name} - ${detalle.price} ({detalle.duration})
                  </div>
                ))}</td>
                <td>${cita.Detalle_citas.reduce((total, detalle) => total + detalle.price, 0)}</td>
                <td>${cita.paid}</td>
                <td>${cita.remaining}</td>
                <td>{cita.date_status}</td>
              </tr>
            ))}
          </tbody>
        </table> */}

        <h5>Canceladas</h5>
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
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
            {canceledAppointments.map(cita => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.date.split('T')[0]}</td>
                <td>{cita.time}</td>
                <td>{cita.Detalle_citas.map(detalle => (
                  <div key={detalle.id_service}>
                    {detalle.Servicio.name} - ${detalle.price} ({detalle.duration})
                  </div>
                ))}</td>
                <td>${cita.Detalle_citas.reduce((total, detalle) => total + detalle.price, 0)}</td>
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
