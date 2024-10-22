import React, { useEffect, useRef, useState } from 'react';
import ApiConnection from '../../../Components/Api/ApiConfig.js';
import { useAuth } from '../../../Components/Context/AuthContext.js';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from '../../../Components/Loading/Loading.js';
import Citas_Reprogramar from '../../../features/Reprogramar/Citas_Reprogramar.js';

function CitasAgendadas() {
    const URLConnection = ApiConnection();
    const { token } = useAuth()
    const toastRef = useRef(null);
    const [userToken, setUserToken] = useState([])
    const [citas, setCitas] = useState([]);
    const [filtroEstado, setFiltradoEstado] = useState('P_Confirmar' || 'Confirmada')
    const [selectedCitaId, setSelectedCitaId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserToken(decodedToken.user)
        }
    }, [token])

    const fetchAppointments = async () => {
        if (userToken && userToken.idUser) {
            const id_user = userToken.idUser;
            try {
                const response = await fetch(`${URLConnection}/dates/${id_user}`);
                const data = await response.json();
                setCitas(data);
            } catch (error) {
                console.log('Error al obtener citas', error);
            }
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [userToken, token]);

    const handleUpdateSuccess = () => {
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'La cita se ha actualizado correctamente', life: 2500 });
        fetchAppointments();
    };
    const citasFiltradas = citas.filter(cita =>
        (citas.sort((a, b) => new Date(b.date) - new Date(a.date))) &&
        (filtroEstado === 'todas' || cita.date_status === filtroEstado)
    );

    return (
        <div className='bg-gray-100 min-h-screen'>
            <div className='max-w-4xl mx-auto p-4'>
                <h1 className='text-2xl font-semibold text-purple-800 mb-6'>Mis Citas Realizadas</h1>
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                        <select className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                            value={filtroEstado}
                            onChange={(e) => setFiltradoEstado(e.target.value)}
                        >
                            <option value='todas'>Todas</option>
                            <option value='Confirmada'>Confirmadas</option>
                            <option value='P_Confirmar'>Pendientes de Confirmación</option>
                            <option value='Atendida'>Atendidas</option>
                            <option value='Cancelada'>Canceladas</option>
                        </select>
                        <button className='btn btn-default' title='Reload' onClick={() => fetchAppointments()}><i className='fa fa-sync-alt'></i></button>
                    </div>
                </div>
                <hr />
                <div className='space-y-4'>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        citasFiltradas?.map(citas => (
                            <div key={citas.id} className='bg-white rounded-lg shadow-md p-4'>
                                <div className='flex justify-between items-center mb-2'>
                                    <h3 className='text-lg font-semibold text-blue-600'>Servicios agendados:</h3>
                                    <span className='text-md text-gray-600'>{new Date(citas.date).toLocaleDateString()}</span>
                                </div>
                                <div className='flex flex-wrap gap-4 mb-4'>
                                    {citas.Detalle_citas.map((details, index) => (
                                        <div className='flex items-center space-x-2'>
                                            <span className='text-lg text-gray-700 font-semibold'>{details.Servicio.name}</span>
                                            <span className='text-sm text-gray-700'></span>
                                        </div>
                                    ))}
                                </div>
                                <div className='flex items-center text-md mb-2 text-gray-700'>
                                    {citas.paid != 0 ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className='text-sm text-gray-700'>Pagado: ${citas.paid.toFixed(2)} Falta por pagar: ${citas.remaining.toFixed(2)}</span>
                                        </>

                                    ) : (
                                        <>

                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 mr-2 text-yellow-600" viewBox="0 0 20 20" fill="currentColor"
                                            >
                                                <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8 4a.905.905 0 00-.9.995l.35 3.507a.552.552 0 001.1 0l.35-3.507A.905.905 0 008 4zm.002 6a1 1 0 100 2 1 1 0 000-2z" />
                                            </svg>
                                            <span className='text-sm text-gray-800 flex'><p className=' me-2 font-semibold'>Pagado:</p> ${citas.paid.toFixed(2)} <p className='ml-2 me-2 font-semibold'>Falta por pagar:</p> ${citas.remaining.toFixed(2)}</span>

                                        </>
                                    )}
                                </div>
                                <div className='flex items-center justify-between mt-2'>
                                    <p className='text-sm capitalize'>
                                        Estado de la cita: <span className={`font-semibold ${citas.date_status === 'P_Confirmar' ? 'text-blue-600' :
                                            citas.date_status === 'Confirmada' ? 'text-orange-600' :
                                                citas.date_status === 'Atendida' ? 'text-green-600' :
                                                    'text-red-600'
                                            }`}>
                                            {citas.date_status}</span>
                                    </p>
                                    <p className='md:text-lg text-purple-800 font-semibold'>Hora agendada : {citas.time}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

    )
}

export default CitasAgendadas;

{/* <div className='p-4 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold mb-6 text-center text-purple-800'> Mis Citas realizadas </h1>
            <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
                <div className='w-full sm:w-auto'>
                    <select className='p-2 border rounded-md w-full'
                        value={filtroEstado}
                        onChange={(e) => setFiltradoEstado(e.target.value)}
                    >
                        <option value='todas'>Todas</option>
                        <option value='Confirmada'>Confirmadas</option>
                        <option value='P_Confirmar'>Pendientes de Confirmación</option>
                        <option value='Atendida'>Atendidas</option>
                        <option value='Cancelada'>Canceladas</option>
                    </select>
                </div>
            </div>
            <div className='space-y-4'>
                {citasFiltradas?.map(cita => (
                    <div key={cita.id} className={`
                            p-4 rounded-lg shadow
                            ${cita.date_status === 'P_Confirmar' || 'No Confirmada' ? 'bg-blue-100' : ''}
                            ${cita.date_status === 'Confirmada' ? 'bg-green-100' : ''}
                            ${cita.date_status === 'Atendida' ? 'bg-yellow-100' : ''}
                            ${cita.date_status === 'Cancelada' ? 'bg-red-100' : ''}
                            `}>
                        <div className='flex items-end justify-end'>
                            <span className='text-sm font-medium px-2 py-1 rounded-full bg-white'>
                                {new Date(cita.date).toLocaleDateString()}
                            </span>
                        </div>

                        {cita.Detalle_citas.map(detalle => (
                            <div key={detalle.id_service} className="mb-2">
                                <h3 className='text-lg font-semibold'>{detalle.Servicio.name}</h3>
                                <p>Duración: {detalle.duration} minutos</p>
                                <p>Precio: ${detalle.price}</p>
                            </div>
                        ))}
                        <div className='flex items-center justify-between mt-2'>
                            <p className='text-sm capitalize'>
                                Estado:  <span className={`font-semibold
                                    ${cita.date_status === 'P_Confirmar' ? 'text-blue-600' : ''}
                                     ${cita.date_status === 'Confirmada' ? 'text-green-600' : ''}
                                     ${cita.date_status === 'Atendida' ? 'text-yellow-600' : ''}
                                     ${cita.date_status === 'Cancelada' ? 'text-red-600' : ''}
                                    `}>
                                    {cita.date_status}
                                </span>
                            </p>
                            <span className='text-sm font-medium'>
                                {cita.time}
                            </span>
                        </div>
                        {cita.date_status === 'P_Confirmar' &&(
                            <button className='px-3 py-2 bg-violet-500 text-white rounded hover:bg-purple-700'
                            onClick={() => {
                                setSelectedCitaId(cita); // Guarda el ID de la cita seleccionada
                                setShowModal(true);
                            }}
                        >
                            Cancelar o Reprogramar
                        </button>
                        )}
                    </div>

                ))}

                {citasFiltradas.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No se encontraron citas con los filtros seleccionados.</p>
                )}
            </div>
            {showModal && <Citas_Reprogramar onBack={()=>setShowModal(false)} service={selectedCitaId} onUpdateSuccess={handleUpdateSuccess}/>}
        </div> */}