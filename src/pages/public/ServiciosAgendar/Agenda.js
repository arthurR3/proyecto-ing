import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../css/agenda_cart.css'
import LoadingSpinner from '../../../Components/Loading/Loading.js';
import { parseDuration } from '../../../Components/Servicios/format_utilsTime.js';
import { fetchBookedSlots, fethService, generateTimes } from '../../../Components/Servicios/ServiciosTime.js';
import { getWorkedExceptions, getWorkedSchedule } from '../../../Components/Api/ApiServices.js';
import ServicesPay from '../../../features/Servicios/ServicePay.js';
function Agenda() {
  const { id } = useParams();
  const navigate = useNavigate()
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [services, setServices] = useState([]);
  const [preSelectedService, setPreSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workDay, setWorkDay] = useState([]);
  const [showLayoutPay, setShowLayoutPay] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [workSchedule, setWorkSchedule] = useState([]);
  const [exceptions, setExceptions] = useState([]);

  const handleServiceChange = (e) => {
    const selectedServiceId = parseInt(e.target.value);
    const service = services.find(service => service.id === selectedServiceId);
    if (service && !selectedServices.includes(service)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const calculateDuration = () => {
    const additionalServicesDuration = selectedServices.reduce((total, service) => total + parseDuration(service.duration), 0);
    return preSelectedService ? parseDuration(preSelectedService.duration) + additionalServicesDuration : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fethService(id, setServices, setPreSelectedService, setLoading, setError)
        setWorkSchedule(await getWorkedSchedule());
        setExceptions(await getWorkedExceptions());
        const data = await getWorkedSchedule()
        setWorkDay(data.map(day => day.dia_semana))
      } catch (error) {
        console.log('Error fetching Data', error)
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      try {
        fetchBookedSlots(selectedDate, setBookedSlots)
      } catch (error) {
        console.error('Error al obtener los horarios reservados:', error);
      }
    }
  }, [selectedDate]);


  const isWorkDay = (date) => {
    const dayOfWeek = date.getDay();
    return workDay.includes(dayOfWeek);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4">
      
      {showLayoutPay ? (
        <ServicesPay onBack={() => setShowLayoutPay(false)} data={{ selectedTime, selectedServices, preSelectedService, selectedDate }} />
      ) : (
        <div className="max-w-7xl bg-white mx-auto p-8">
          <div className='flex items-center mb-4'>
                <i className='fa-solid ml-3 fa-arrow-left' onClick={() => navigate(-1)}>
                    <span onClick={() => navigate(-1)} className=' font-normal text-xl ml-4 text-blue-600 hover:text-blue-800 cursor-pointer'>
                        Regresar
                    </span>
                </i>
            </div>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-purple-700">SERVICIO {preSelectedService ? preSelectedService.name : ''}</h3>
            <p className="text-lg text-gray-500">Reservar Cita</p>
          </div>
          <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto md:grid-cols-3 md:p-8">
            {/* Servicios Extras */}
            <div className="bg-white p-6 space-y-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800">Servicios Extras:</h3>
              <select className="w-full mt-4 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={handleServiceChange}>
                <option value={null}>Seleccionar Servicio extra:</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
              <div className="space-y-4">
                {selectedServices.map(service => (
                  <div key={service.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{service.name}</p>
                      <p className="text-sm text-gray-600">Duración: {service.duration}</p>
                      <p className="text-sm text-gray-600">Costo: ${service.price.toFixed(2)}</p>
                    </div>
                    <button className="text-red-500 hover:text-red-700" onClick={() => setSelectedServices(selectedServices.filter(s => s.id !== service.id))}>Eliminar</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800">Elegir fecha:</h3>
              <div className="mt-4">
                <DatePicker
                  id="fecha"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  showDisabledMonthNavigation
                  dateFormat="dd/MM/yyyy"
                  filterDate={isWorkDay} // Aquí aplicas el filtro para deshabilitar
                />
              </div>
            </div>
            {selectedDate && (
              <>
                <div className='bg-white p-6 rounded-lg w-full shadow-lg'>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Elegir horario:</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    {generateTimes(calculateDuration, bookedSlots, workSchedule, exceptions, selectedDate).length > 0 ? (
                      generateTimes(calculateDuration, bookedSlots, workSchedule, exceptions, selectedDate).map((time, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(time)}
                          className={` border border-cyan-200 rounded-md px-2 py-2 text-sm font-medium 
                            ${selectedTime === time ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-500 hover:text-white'} 
                            focus:outline-none focus:ring-2 focus:ring-lime-500`}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <div className='col-span-2 text-center text-gray-500'>
                        No hay horarios disponibles para la fecha seleccionada.
                      </div>
                    )}
                  </div>

                </div>
                <div className='col-span-1 flex mt-4 justify-end md:col-span-3'>
                  <button className='bg-purple-600 text-white rounded-md px-6 py-3 text-md font-medium shadow transition-colors hover:bg-fuchsia-600/90' onClick={() => setShowLayoutPay(true)}>
                    Continuar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

}

export default Agenda;