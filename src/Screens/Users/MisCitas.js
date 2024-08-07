import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { useAuth } from '../../Componentes/Context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import { Button, Modal } from 'react-bootstrap';
import LoadingSpinner from '../../Componentes/Loading/Loading.js';

function CitasAgendadas() {
    const URLConnection = ApiConnection();
    const { token } = useAuth();
    const data = jwtDecode(token);
    const idUser = data.user.idUser;
    const [citas, setCitas] = useState([]);
    const [selectedCitaId, setSelectedCitaId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${URLConnection}/dates/${idUser}`);
                setCitas(response.data);
            } catch (error) {
                setLoading(false);
                toast.error('Error al obtener las citas:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };

        fetchCitas();
    }, [idUser, URLConnection]);

    const handleCancelCita = (citaId) => {
        setSelectedCitaId(citaId);
        setShowModal(true);
    };

    const cancelCita = (citaId) => {
        axios.put(`${URLConnection}/dates/${citaId}`, { date_status: 'Cancelada' })
            .then(() => {
                toast.success('Cita cancelada exitosamente');
                setCitas(citas.map(cita =>
                    cita.id === citaId ? { ...cita, date_status: 'Cancelada' } : cita
                ));
            })
            .catch(error => {
                toast.error('Error al cancelar la cita:', error);
            });
    };

    const renderCitasByStatus = (status) => (
        <div className='bg-light p-4 rounded mb-4'>
            <h5>{status}</h5>
            <table className='table'>
                <thead className="table-dark">
                    <tr>
                        <th>Correo Electrónico</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Servicios</th>
                        <th>Estado de Pago</th>
                        <th>Estado de la Cita</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {citas.filter(cita => cita.date_status === status).map(cita => (
                        <tr key={cita.id}>
                            <td>{cita.Usuario.email}</td>
                            <td>{new Date(cita.date).toLocaleDateString()}</td>
                            <td>{cita.time}</td>
                            <td>
                                {cita.Detalle_citas.map(detalle => (
                                    <div key={detalle.id_service}>
                                        {detalle.Servicio.name} - ${detalle.price} ({detalle.duration})
                                    </div>
                                ))}
                            </td>
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
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='py-5 mt-4'>
            <div className='col-md-offset-1 col-md-12'>
                <div className='panel'>
                    <div className='panel-heading'>
                        <div className='row d-flex'>
                            <div className='col'>
                                <h4 className='title'>Mis Citas Agendadas</h4>
                            </div>
                            <div className='col text-right d-flex mb-3 justify-content-between'>
                                <div className='btn-group'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Buscar'
                                    />
                                    <button className='btn btn-default' title='Reload'>
                                        <i className='fa fa-sync-alt fa-lg'></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className='row'>
                <div className='col-md-12'>
                    {renderCitasByStatus('Agendada')}
                    {renderCitasByStatus('Confirmada')}
                    {renderCitasByStatus('Atendida')}
                    {renderCitasByStatus('Cancelada')}
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
