import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal } from 'react-bootstrap'; 
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import CitaDetalle from './CitaDetalle';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../Componentes/Loading/Loading';

const URLConnection = ApiConnection();

const CitasList = () => {
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false)
    const [appointments, setAppointments] = useState([]);
    const [showLayout, setShowLayout] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${URLConnection}/dates`);
            const data = await response.json();
            setAppointments(data || []); 
            setLoading(false)
            setTotalPages(data.totalPages || 1); 
        } catch (error) {
            setLoading(false);
           toast.error('Vuelva refrescar la pagina, Por favor!')
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [currentPage, itemsPerPage]);

    const handleSetLayout = (appointment) => {
        setSelectedCita(appointment);
        setShowLayout(true);
    };
    useEffect(() => {
        const filter = queryParams.get('filter') || '';
        setStatusFilter(filter);
    }, [location.search]);

    
    const handleCancelAppointment = async (id) => {
        try {
            await axios.put(`${URLConnection}/dates/${id}`, {date_status: 'Cancelada'});
            fetchAppointments(); 
        } catch (error) {
            console.error('Error al cancelar la cita:', error);
        }
    };

    const handleMarkAsAttended = async (appointment) => {
        const id = appointment.id
        if (appointment.paid < appointment.Detalle_citas.price) {
            setPaymentDetails({
                id: appointment.id,
                total_amount: appointment.Detalle_citas.price,
                amount_paid: appointment.paid,
                amount_due: appointment.Detalle_citas.price - appointment.paid
            });
            setShowPaymentModal(true);
        }
          await axios.put(`${URLConnection}/dates/${id}`, {date_status: 'Atendida'});
            
          fetchAppointments(); 
    };

    const handleReSchedule = (id) => {
        navigation(`/citas/reschedule/${id}`);
    };

    const handleEditAppointment = (id) => {
        navigation(`/citas/edit/${id}`);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
    };

    const filteredAppointments = appointments.filter(appointment => {
        const userName = appointment.Usuario ? `${appointment.Usuario.name} ${appointment.Usuario.last_name1} ${appointment.Usuario.last_name2}` : '';
        const matchesSearchQuery = userName.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatusFilter = statusFilter ? appointment.date_status === statusFilter : (appointment.date_status === 'Confirmada' || appointment.date_status === 'P_confirmar');

        return matchesSearchQuery && matchesStatusFilter;
    });

    const sortedAppointments = filteredAppointments.sort((a, b) => {
        const statusOrder = ['Confirmada', 'P_confirmar', 'Pendiente', 'Cancelada'];
        const statusComparison = statusOrder.indexOf(a.date_status) - statusOrder.indexOf(b.date_status);

        if (statusComparison !== 0) {
            return statusComparison;
        }

        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return aDate - bDate || a.time.localeCompare(b.time);
    });

    if(loading){
        return <LoadingSpinner/>
    }
    return (
        <div className="container py-5 mt-5">
            <div className='col-md-offset-1 col-md-12'>
                <div className='panel'>
                    <div className='panel-heading'>
                        <div className='row d-flex'>
                            <div className='col'>
                                <h4 className='title'>Citas Programadas</h4>
                            </div>
                            {showLayout ? (
                                <CitaDetalle appointment={selectedCita} />
                            ) : (
                                <>
                                    <div className='col text-right d-flex mb-3 justify-content-between'>
                                        <div className='btn-group'>
                                            <button
                                                className='btn btn-default'
                                                title='Recargar'
                                                onClick={fetchAppointments}
                                            >
                                                <i className='fa fa-sync-alt'></i>
                                            </button>
                                            <button
                                                className='btn btn-default'
                                                title='Descargar Excel'
                                                // onClick={() => exportToExcel(appointments, fileName)}
                                            >
                                                <i className='fa fa-file-excel'></i>
                                            </button>
                                            <button
                                                className="btn btn-default"
                                                onClick={() => handleSetLayout(null)}
                                            >
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                            <div className='d-flex justify-content-between mb-2'>
                                                <select
                                                    className='form-select me-5'
                                                    value={statusFilter}
                                                    onChange={handleStatusFilter}
                                                >
                                                    <option value=''>Todos los estados</option>
                                                    <option value='Confirmada'>Confirmada</option>
                                                    <option value='P_confirmar'>P_confirmar</option>
                                                    <option value='pendiente'>Pendiente</option>
                                                    <option value='Cancelada'>Cancelada</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <hr />
                                    
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Nombre del Usuario</th>
                                                <th>Servicios</th>
                                                <th>Fecha y Hora</th>
                                                <th>Status</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedAppointments.length > 0 ? (
                                                sortedAppointments.map((appointment) => (
                                                    <tr key={appointment.id}>
                                                        <td>{appointment.Usuario ? `${appointment.Usuario.name} ${appointment.Usuario.last_name1} ${appointment.Usuario.last_name2}` : 'Usuario no encontrado'}</td>
                                                        <td>
                                                            {appointment.Detalle_citas && appointment.Detalle_citas.length > 0 ? (
                                                                appointment.Detalle_citas.map(detalle => (
                                                                    <div key={detalle.id_service}>
                                                                        {detalle.Servicio.name} - ${detalle.price} ({detalle.duration})
                                                                    </div>
                                                                ))
                                                            ) : 'No hay detalles'}
                                                        </td>
                                                        <td>{`${new Date(appointment.date).toLocaleDateString()} ${appointment.time}`}</td>
                                                        <td>
                                                            {appointment.date_status === 'Confirmada' ? (
                                                                <Badge bg="success">Confirmada</Badge>
                                                            ) : appointment.date_status === 'P_confirmar' ? (
                                                                <Badge bg="info">P_confirmar</Badge>
                                                            ) : appointment.date_status === 'Cancelada' ? (
                                                                <Badge bg="danger">Cancelada</Badge>
                                                            ) : (
                                                                <Badge bg="warning">Pendiente</Badge>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {appointment.date_status !== 'Cancelada' && (
                                                                <>
                                                                    <Button 
                                                                        variant="success" 
                                                                        className='me-3 btn-sm'
                                                                        onClick={() => handleMarkAsAttended(appointment)}
                                                                    >
                                                                        Atendida
                                                                    </Button>
            
                                                                    <Button 
                                                                        variant="danger" 
                                                                        className='btn-sm me-3'
                                                                        onClick={() => handleCancelAppointment(appointment.id)}
                                                                    >
                                                                        Cancelar
                                                                    </Button>
                                                                </>
                                                            )}
                                                            <Button 
                                                                variant="secondary" 
                                                                className='me-3 btn-sm'
                                                                onClick={() => navigation(`/admin/admin/cita-detalle/${appointment.id_user}`)}
                                                            >
                                                                Ver
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No se encontraron citas</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                    
                                    {/* Pagination */}
                                    {/* <div className='d-flex justify-content-between'>
                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </Button>
                                        <span>Página {currentPage} de {totalPages}</span>
                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Siguiente
                                        </Button>
                                    </div> */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
           {/*  <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Total del Servicio: ${paymentDetails?.total_amount}</p>
                    <p>Monto Pagado: ${paymentDetails?.amount_paid}</p>
                    <p>Monto Restante: ${paymentDetails?.amount_due }</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handlePaymentCompletion}>
                        Marcar como Pagado Completo
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </div>
    );
};

export default CitasList;
