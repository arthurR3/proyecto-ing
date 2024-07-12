import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../CSS/agenda_cart.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getService } from '../../Componentes/Api/ApiServices';

const availableTimes = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
];

const parseTime = timeStr => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
};

const formatTime = (hours, minutes) => {
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
  const {id} = useParams();  // Obtener el ID del servicio desde los parámetros
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [services, setServices] = useState([]);
  const [preSelectedService, setPreSelectedService] = useState(null);
  const [error, setError] = useState(null);

  const handleServiceChange = (e) => {
    const selectedServiceId = parseInt(e.target.value);
    const service = services.find(service => service.id === selectedServiceId);
    if (service && !selectedServices.includes(service)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleRemoveService = (id) => {
    setSelectedServices(selectedServices.filter(service => service.id !== id));
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const calculateDuration = () => {
    const additionalServicesDuration = selectedServices.reduce((total, service) => total + parseDuration(service.duration), 0);
    return preSelectedService ? parseDuration(preSelectedService.duration) + additionalServicesDuration : 0;
  };

  const generateTimes = () => {
    const totalDuration = calculateDuration();
    return availableTimes.map(time => {
      const { hours, minutes } = parseTime(time);
      const endHours = hours + Math.floor((minutes + totalDuration) / 60);
      const endMinutes = (minutes + totalDuration) % 60;
      return totalDuration > 0 ? `${time} - ${formatTime(endHours, endMinutes)}` : `${time}`;
    });
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getService();
        setServices(data);
        const preSelected = services.find(service => service.id === parseInt(id));
        setPreSelectedService(preSelected);
        console.log(preSelected)
        console.log(preSelectedService.name)
      } catch (error) {
        setError(error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className='container-fluid px-1 px-md-2 px-lg-4 py-5 mx-auto'>
      <div className='row d-flex justify-content-center'>
        <div className='col-xl-10 col-lg-9 col-md-10 col-sm-11'>
          <div className='card border-0'>
            <h3 className='mb-4 text-center'>SERVICIO {preSelectedService.name}</h3>
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
                          <button className='btn btn-danger btn-sm' onClick={() => handleRemoveService(service.id)}>Eliminar</button>
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
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <div className='mt-3'>
                    <button className='btn btn-success ml-2'>Continuar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Agenda;