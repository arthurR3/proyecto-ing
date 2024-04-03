import React, { useEffect, useState } from 'react'
import '../../CSS/citas.css'
import Img1 from '../../Image/image1.jpg'
import { toast } from 'react-toastify';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import axios from 'axios';

const URLConnection = ApiConnection();
function AgendarCita() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState();
  const [time, setTime] = useState('')

  useEffect(() => {
    // Llamar a la API para obtener la lista de servicios
    axios.get(`${URLConnection}/services`)
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        toast.error('Error al obtener los servicios:', error);
      });
  }, []);


  const handleSubmit = () => {
    if (!services || !date || !time) {
      toast.error('No dejes ningún campo vacío!', {
        position: 'top-right',
        className: 'mt-5'
      })
      return;
    }
    console.log(date, 'service ' + time)

  }

  return (
    <div className='citas-container'>
      <div className='row'>
        <div className='col-md-6'>
          <img className='img-cita'
            src='https://jarturoonline.000webhostapp.com/maq-estetica/img/Cita.png' alt='foto'
          />
        </div>
        <div className='col-md-4 formulario-cita'>
          <div className='bg-light p-4 rounded'>
            <h1 className='mb-4  fw-bold'>Agendar Cita</h1>
            <form >
              <div className='mb-3'>
                <label htmlFor='servicio' className='form-label fw-bold'>Elije el Servicio : </label>
                <select id='servicio' className='form-select' value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                  <option value=''>Selecciona un servicio</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              <div className='mb-3'>
                <label htmlFor='fecha' className='form-label fw-bold'>Fecha : </label>
                <input id='fecha' className='form-control' type='date' value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className='mb-3'>
                <label htmlFor='hora' className='form-label fw-bold'>Hora : </label>
                <input id='hora' className='form-control' type='time' value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <input className='btn btn-success' type='button'
                value='Agendar Cita' onClick={handleSubmit}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgendarCita
