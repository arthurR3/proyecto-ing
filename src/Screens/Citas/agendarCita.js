import React, { useState } from 'react'
import '../../CSS/citas.css'
import Img1 from '../../Image/image1.jpg'
import { toast } from 'react-toastify';

function AgendarCita() {
  const [service, setService] = useState('');
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const handleSubmit = () => {
    if (!service || !date || !time) {
      toast.error('No dejes ningún campo vacío!', {
        position: 'top-right',
        className: 'mt-5'
      })
      return;
    }
    if(sessionStorage.getItem() === false){
      alert('Ingresa a tu cuenta para agendar una cita')
      return
    }
  }

  return (
    <div className='citas-container'>
      <div className='row'>
        <div className='col-md-6'>
          <img className='img-cita'
            src={Img1} alt='foto'
          />
        </div>
        <div className='col-md-4 formulario-cita'>
          <div className='bg-light p-4 rounded'>
            <h1 className='mb-4  fw-bold'>Agendar Cita</h1>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='servicio' className='form-label  fw-bold'>Elije el Servicio : </label>
                <input id='servicio' 
                className='form-control' 
                type='text' 
                value={service}
                onChange={setService}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='fecha' className='form-label  fw-bold'>Fecha</label>
                <input id='fecha' className='form-control' type='date' />
              </div>
              <div className='mb-3'>
                <label htmlFor='hora' className='form-label  fw-bold'>Hora</label>
                <input id='hora' className='form-control' type='time' />
              </div>
              <button className='btn btn-success' onClick={handleSubmit}>Agendar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgendarCita
