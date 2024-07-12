import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal } from 'react-bootstrap'; // Asegúrate de importar Modal
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import CitaDetalle from './CitaDetalle';
import { useNavigate } from 'react-router-dom';
const URLConnetion = ApiConnection();

const CitasList = () => {
    const navigation = useNavigate()
    const [appointments, setAppointments] = useState([]);
    const [showLayout, setShowLayout] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
            const response = await fetch(`${URLConnetion}/dates`); // Ajusta la URL según tu API
            const data = await response.json();
            setAppointments(data);
            } catch (error) {
                navigation('/Error-500')
            }
            
        };
        fetchAppointments();
    }, []);

    const handleSetLayout = (appointment)=>{
        setSelectedCita(appointment)
        setShowLayout(true)
    }
    return (
        <div className="container py-5 mt-5">
            <h3>Citas Agendadas</h3>
            {showLayout ? (
                <CitaDetalle appointment={selectedCita}/>
            ) : (
                <>
                <div className="navbar bg-body-tertiary nav-color m-3">
                <div className="container-fluid">
                    <a className="navbar-brand">Filtrado por</a>
                    <select
                        className="form-select me-2"
                        aria-label="Filtrar por fecha"
                    >
                        <option value="todas">Todas</option>
                        <option value="semana">Este dia</option>
                        <option value="mes">Semana</option>
                        <option value="año">Mes</option>
                    </select>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre del Usuario</th>
                        <th>Servicio</th>
                        <th>Fecha y Hora</th>
                        <th>Status</th>
                        <th>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td>{appointment.Usuario ? `${appointment.Usuario.name} ${appointment.Usuario.last_name1} ${appointment.Usuario.last_name2}` : 'Usuario no encontrado'}</td>
                            <td>{appointment.Servicio ? appointment.Servicio.name : 'Servicio no encontrado'}</td>
                            <td>{`${appointment.date.split('T')[0]} ${appointment.time}`}</td>
                            <td>
                                {appointment.date_status === 'Confirmada' ? (
                                    <Badge bg="success">Confirmada</Badge>
                                ) : (
                                    <Badge bg="warning">Pendiente</Badge>
                                )}
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleSetLayout(appointment)}>Ver</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </>
            )}
        </div>
    );
};

export default CitasList;
