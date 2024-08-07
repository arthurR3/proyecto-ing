import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../CSS/agenda_cart.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getService, getBookedSlots } from '../../Componentes/Api/ApiServices';
import LoadingSpinner from '../../Componentes/Loading/Loading';
import ServicesPay from './ServicePay';
import { useAuth } from '../../Componentes/Context/AuthContext';
const parseTime = timeStr => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes; // return total minutes
};

const formatTime = totalMinutes => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedH = hours % 12 || 12;
  const adjustedMin = minutes.toString().padStart(2, '0');
  return `${adjustedH}:${adjustedMin} ${period}`;
};

const parseDuration = durationStr => {
  const [hours, minutes, seconds] = durationStr.split(':').map(Number);
  return hours * 60 + minutes + seconds / 60;
};

function Agenda() {
  const { id } = useParams();
  const {token} = useAuth();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [services, setServices] = useState([]);
  const [preSelectedService, setPreSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLayoutPay, setShowLayoutPay] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

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

 const isTimeSlotAvailable = (startTime, endTime, bookedSlots) =>{
  return !bookedSlots.some(slot =>{
    const slotStart = parseTime(slot.start);
    const slotEnd = parseTime(slot.end);
    return( startTime < slotEnd && endTime > slotStart)
  })
  }
  const generateTimes = () => {
    const totalDuration = calculateDuration()
    const endOfDay = parseTime('08:00 PM')
    const times = [];
    let timeInicial = parseTime('09:00 AM');

    while (timeInicial + totalDuration <= endOfDay) {
      const timeFinal = timeInicial + totalDuration
      if(isTimeSlotAvailable(timeInicial, timeFinal, bookedSlots)){
        times.push(`${formatTime(timeInicial)} - ${formatTime(timeFinal)}`)
      }
      timeInicial = timeFinal;
    }
    console.log(times)
    return times;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getService();
        setServices(data);
        const selectedService = data.find(service => service.id === parseInt(id));
        setPreSelectedService(selectedService);
        setTimeout(() => setLoading(false), 2000);
      } catch (error) {
        setError(error);
      }
    };
    fetchServices();
  }, [id]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (selectedDate) {
        try {
          const response = await getBookedSlots(selectedDate.toISOString());
          const slots = response.map(slot => {
            const [start, end] = slot.Horario.split(' - ');
            return {
              start: start.trim(),
              end: end.trim()
            };
          });
          setBookedSlots(slots);
        } catch (error) {
          console.error('Error al obtener los horarios reservados:', error);
        }
      }
    };
    fetchBookedSlots();
  }, [selectedDate]);
  

  const isNotSunday = date => {
    // getDay() devuelve 0 para domingo
    return date.getDay() !== 0;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='container-fluid px-1 px-md-2 px-lg-4 py-5 mx-auto'>
      {showLayoutPay ? (
        <ServicesPay onBack={() => setShowLayoutPay(false)} data={{ selectedTime, selectedServices, preSelectedService, selectedDate }} />
      ) : (
        <div className='row d-flex justify-content-center'>
          <div className='col-xl-10 col-lg-9 col-md-10 col-sm-11'>
            <div className='card border-0'>
              <h3 className='mb-4 text-center'>SERVICIO {preSelectedService ? preSelectedService.name : ''}</h3>
              <div className='row justify-content-center'>
                <h3 className='mb-4'>Reservar Cita</h3>
              </div>
              <div className='row'>
                <div className='col-md-4 border-line pb-3'>
                  <div className='form-group'>
                    <select className='form-select mb-2' aria-label='Default select example' onChange={handleServiceChange}>
                      <option value=''>Seleccionar servicio extra</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>{service.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className='form-group'>
                    <div className="row px-3">
                      <ul className='list-group mt-3'>
                        <span className='text-sm text-muted'>Servicios Extras: </span>
                        {selectedServices.map(service => (
                          <li key={service.id} className='list-group-item d-flex justify-content-between align-items-center'>
                            <div>
                              <span className='fw-bold'>{service.name}</span>
                              <div className='text-muted'>Duración: {service.duration}</div>
                              <div className='text-muted'>Costo: ${service.price.toFixed(2)}</div>
                            </div>
                            <button className='btn btn-danger btn-sm' onClick={() => setSelectedServices(selectedServices.filter(s => s.id !== service.id))}>Eliminar</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-md-4 text-center'>
                  <small className='text-sm fs-6 text-muted'>Elige una fecha</small>
                  <DatePicker id='fecha' selected={selectedDate} onChange={(date) => setSelectedDate(date)} minDate={new Date()}
                    showDisabledMonthNavigation
                    dateFormat='dd/MM/yyyy'
                    inline
                    filterDate={isNotSunday} // Aquí aplicas el filtro para deshabilitar los domingos
                  />
                </div>
                {selectedDate && (
                  <div className='col-md-4 text-center'>
                    <small className='text-sm fs-6 m-2 text-muted mb-4'>Elige una hora</small>
                    <div className='d-flex flex-wrap justify-content-center'>
                      {generateTimes().map((time, index) => (
                        <button
                          key={index}
                          className={`btn btn-sm m-1 ${selectedTime === time ? 'btn-selected' : 'btn-outline-selected'}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <div className='mt-3'>
                      <button className='btn btn-success ml-2' onClick={() => setShowLayoutPay(true)}>Continuar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agenda;