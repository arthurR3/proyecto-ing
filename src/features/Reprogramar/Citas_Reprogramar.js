import React, { useEffect, useRef, useState } from 'react';
import { getWorkedExceptions, getWorkedSchedule } from '../../Components/Api/ApiServices';
import { fetchBookedSlots, generateTimes } from '../../Components/Servicios/ServiciosTime';
import { parseDuration } from '../../Components/Servicios/format_utilsTime';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CloudHail } from 'lucide-react';
import axios from 'axios';
import ApiConnection from '../../Components/Api/ApiConfig';
import { Toast } from 'primereact/toast';
const URLConnection = ApiConnection()

const Citas_Reprogramar = ({ onBack, service, onUpdateSuccess }) => {
    const toast = useRef(null)
    const [workDay, setWorkDay] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [workSchedule, setWorkSchedule] = useState([]);
    const [exceptions, setExceptions] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [confirmacionCancelacion, setConfirmacionCancelacion] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const schedule = await getWorkedSchedule();
                setWorkSchedule(schedule);
                setExceptions(await getWorkedExceptions());
                setWorkDay(schedule.map(day => day.dia_semana));
            } catch (error) {
                console.log('Error fetching data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            // Lógica para obtener horarios reservados según la fecha
            fetchBookedSlots(selectedDate, setBookedSlots);
        }
    }, [selectedDate]);

    const isWorkDay = (date) => {
        const dayOfWeek = date.getDay();
        return workDay.includes(dayOfWeek);
    };


    const calculateDuration = () => {
        const totalDuration = service.Detalle_citas.reduce((total, detalle) => {
            return total + parseDuration(detalle.duration); // Asumiendo que detalle.duration es un string de tiempo
        }, 0);

        return totalDuration; // Retorna la duración total en minutos o en el formato que necesites
    };

    const handleUpdateDate = async (selectedDate, selectedTime) => {
        try {
            await axios.put(`${URLConnection}/dates/${service.id}`, {
                date: selectedDate,
                time: selectedTime
            })
                .then(response => {
                    if (response.data.success) {
                        onBack();
                        onUpdateSuccess()
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ingreso Fallido ' + response.data.message, life: 3000 });
                    }
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ingreso Fallido catch' + error, life: 3000 });
                })

        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ingreso Fallido ULTIMO ' + error, life: 3000 });
        }
    }

    const handleCancel = async () => {
        try {
            await axios.put(`${URLConnection}/dates/${service.id}`, { date_status: 'Cancelada' })
                .then((response) => {
                    if (response.data.success) {
                        onBack();
                        setConfirmacionCancelacion(false)
                        window.location.reload()
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ingreso Fallido ' + response.data.message, life: 3000 });
                    }
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cancelar la cita ' + error, life: 3000 });
                })
        } catch (error) {

        }
    }
    return (
        <>
            <Toast ref={toast} />
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center  p-4'>
                <div className='bg-white rounded-lg p-6 max-w-full'>
                    <h2 className='text-xl font-bold text-purple-600'>Reprogramar Cita</h2>
                    <p className='text-gray-600 mb-4'>Puedes reprogramar la cita para otro día o si deseas cancelarla.</p>
                    {selectedDate ? (

                        <div>
                            <label htmlFor="timeSelect" className='block mb-2'>Selecciona la hora:</label>
                            <select
                                id="timeSelect"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full p-2 border rounded-md mb-4"
                            >
                                <option value="">Selecciona una hora</option>
                                {generateTimes(calculateDuration, bookedSlots, workSchedule, exceptions, selectedDate).map((time, index) => (
                                    <option key={index} value={time}>{time}</option>
                                ))}
                            </select>

                            <button
                                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                                onClick={() => handleUpdateDate(selectedDate, selectedTime)}
                                disabled={!selectedTime}
                            >
                                Confirmar Reprogramación
                            </button>
                        </div>

                    ) : (
                        <>
                            <DatePicker
                                id="fecha"
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                minDate={new Date()}
                                showDisabledMonthNavigation
                                dateFormat="dd/MM/yyyy"
                                inline
                                filterDate={isWorkDay} // Aquí aplicas el filtro para deshabilitar
                            />


                        </>
                    )}
                    <div className='flex gap-4'>
                        <button className='px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:text-white' onClick={() => setConfirmacionCancelacion(true)}>
                            Cancelar cita
                        </button>
                        <button className='px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-600 hover:text-white' onClick={onBack}>
                            Salir
                        </button>
                    </div>

                </div>
            </div>
            {confirmacionCancelacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4 text-purple-700">Confirmar Cancelación</h2>
                        <p className="mb-4">¿Estás seguro de que deseas cancelar esta cita?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={()=> handleCancel()}
                            >
                                Sí, Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                onClick={() => { setConfirmacionCancelacion(false); onBack() }}
                            >
                                No, Mantener Cita
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>

    );
};

export default Citas_Reprogramar;
