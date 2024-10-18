import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ApiConnection from '../../../Components/Api/ApiConfig.js';

import { useAuth } from '../../../Components/Context/AuthContext.js';
import { jwtDecode } from 'jwt-decode';
import { Calendar as CalendarIcon, Scissors, User } from 'lucide-react'
import LoadingSpinner from '../../../Components/Loading/Loading.js';
import Citas_Reprogramar from '../../../features/Reprogramar/Citas_Reprogramar.js';

function CitasAgendadas() {
    const URLConnection = ApiConnection();
    const { token } = useAuth()
    const [userToken, setUserToken] = useState([])
    const [citas, setCitas] = useState([]);
    const [filtroEstado, setFiltradoEstado] = useState('P_Confirmar' || 'Confirmada')
    const [selectedCitaId, setSelectedCitaId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() =>{
        if(token){
            const decodedToken = jwtDecode(token);
            setUserToken(decodedToken.user)
        }
    },[token])

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

    // Llamar a fetchAppointments cuando el componente se monte o cambie userToken
    useEffect(() => {
        fetchAppointments(); // Llama a la función aquí
    }, [userToken, token]); // Asegúrate de incluir todas las dependencias necesarias

    const handleUpdateSuccess = () => {
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'La cita se ha actualizado correctamente', life: 2500 });
        fetchAppointments();
    };
    const citasFiltradas = citas.filter(cita => 
    (citas.sort((a,b) => new Date(b.date) - new Date(a.date))) &&
         (filtroEstado === 'todas' || cita.date_status === filtroEstado)
    );

    return (
        <div className='p-4 max-w-4xl mx-auto'>
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
        </div>
    );
}

export default CitasAgendadas;