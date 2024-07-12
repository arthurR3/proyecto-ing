import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { useAuth } from '../../Componentes/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Button, Modal } from 'react-bootstrap';

function CitasAgendadas() {
    const URLConnection = ApiConnection();
    const { token } = useAuth();
    const data = jwtDecode(token)
    const idUser = data.user.idUser
    console.log(idUser)
    const [citas, setCitas] = useState([]);
    const [selectedCitaId, setSelectedCitaId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Llamar a la API para obtener las citas agendadas
        axios.get(`${URLConnection}/dates/${idUser}`)
            .then(response => {
                setCitas(response.data);
            })
            .catch(error => {
                toast.error('Error al obtener las citas:', error);
            });
    }, []);

    const handleCancelCita = (citaId) => {
        setSelectedCitaId(citaId);
        setShowModal(true);
    };

    const cancelCita = (citaId) => {
        axios.put(`${URLConnection}/dates/${citaId}`, { date_status: 'Cancelada' })
            .then(() => {
                toast.success('Cita cancelada exitosamente');
            })
            .catch(error => {
                toast.error('Error al cancelar la cita:', error);
            });
    };

    return (
        <div className='py-5'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='bg-light p-4 rounded'>
                        <table className='table'>
                            <thead className="table-dark">
                                <tr>
                                    <th>Correo Electrónico</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Servicio</th>
                                    <th>Estado de Pago</th>
                                    <th>Estado de la Cita</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {citas.map(cita => (
                                    <tr key={cita.id}>
                                        <td>{cita.Usuario.email}</td>
                                        <td>{new Date(cita.date).toLocaleDateString()}</td>
                                        <td>{cita.time}</td>
                                        <td>{cita.Servicio.name}</td>
                                        <td>{cita.payment_status} - ${cita.remaining.toFixed(2)}</td>
                                        <td>{cita.date_status}</td>
                                        <td>
                                            {cita.date_status !== 'Cancelada' && (
                                                <button
                                                    className='btn btn-danger'
                                                    onClick={() => handleCancelCita(cita.id)}
                                                >
                                                    Cancelar Cita
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Cancelación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas cancelar esta cita?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => { cancelCita(selectedCitaId); setShowModal(false); }}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CitasAgendadas;
