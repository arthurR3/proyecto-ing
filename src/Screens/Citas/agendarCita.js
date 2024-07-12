import React, { useEffect, useState } from 'react'
import '../../CSS/citas.css'
import Img1 from '../../Image/image1.jpg'
import { toast } from 'react-toastify';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CustomModal from '../../Componentes/Modal';
import { useAuth } from '../../Componentes/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker'
const emailRegexp = new RegExp(/[^@\t\r\n]+@[^@\t\r\n]+\.[^@\t\r\n]+/);
const URLConnection = ApiConnection();

function AgendarCita() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalC, setShowModalC] = useState(false);
  const [step, setStep] = useState('agendar');
  const [timeSlot, setTimeSlot] = useState({ start: '', end: '' });
  // Función para filtrar los días domingo
  const filterSunday = (date) => {
    return date.getDay() !== 0; // Devuelve true si el día no es domingo
  };
  const [formData, setFormData] = useState({
    name: '',
    last_name1: '',
    last_name2: '',
    phone: '',
  });
  const removeSelectedService = (serviceIdToRemove) => {
    setSelectedService(selectedService.filter(serviceId => serviceId !== serviceIdToRemove));
  };

  // Estado inicial para el correo electrónico con validación
  const [credentials, setCredentials] = useState({
    email: {
      value: '',
      hasError: false,
    },
  });

  function handleChangeEmail(evt) {
    const { name, value } = evt.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: {
        value,
      },
    }));
  }

  function handleBlur() {
    const emailHasError = !emailRegexp.test(credentials.email.value);

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      email: {
        ...prevCredentials.email,
        hasError: emailHasError,
      },
      password: {
        ...prevCredentials.password,
      },
    }));
  }

  useEffect(() => {
    // Si hay autenticación, actualizar los campos con la información del usuario
    if (token) {
      const data = jwtDecode(token);
      setFormData({
        name: data.user.nombre || '',
        last_name1: data.user.lastName || '',
        last_name2: data.user.lastName2 || '',
        phone: data.user.telefono || '',
      });
      setCredentials({
        email: {
          value: data.user.email || '',
          hasError: false,
        },
      });
    } 
  }, [token]);

  useEffect(() => {
    // Llamar a la API para obtener la lista de servicios
    axios.get(`${URLConnection}/services`)
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        toast.warn('Error al obtener los servicios:', error);
      });
  }, []);


  useEffect(() => {
    if (showModal) {
      axios.post(`${URLConnection}/users/confirmation-email`, {
        email: credentials.email.value
      })
        .then(response => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: 'top-right',
              className: 'mt-5'
            })
          } else {
            const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
            toast.error('Ingreso fallido. ' + errorMessage, {
              position: 'top-center',
              className: 'mt-5'
            });
          }
        })
        .catch(error => {
          console.log(error)
          toast.error('Error al enviar el correo:', error);
        });
    }
  }, [showModal]);

  const calculateAvailableServices = (serviceDuration, selectedDate) => {
    const serviceDrtMinutes = parseInt(serviceDuration.split(' ')[0]) * 60;
    const startTime = new Date(selectedDate);
    startTime.setHours(9, 0, 0);
    const endTime = new Date(selectedDate);
    endTime.setHours(18, 0, 0);

    const availableTimes = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
      const endTimeSlot = new Date(currentTime.getTime() + serviceDrtMinutes * 60000);
      if (endTimeSlot <= endTime) {
        availableTimes.push({
          start: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          end: endTimeSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      currentTime = endTimeSlot;
    }
    return availableTimes
  }


  useEffect(() => {
    if (selectedService && date) {
      const serviceDuration = services.find(service => service.id === parseInt(selectedService));
      if (serviceDuration) {
        const times = calculateAvailableServices(serviceDuration.duration, date);
        setAvailableTimes(times);
      } else {
        setAvailableTimes([]);
      }
    }
  }, [selectedService, date, services])


  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
    setError('')
  }

  const validationPhone = (e) => {
    const value = e.target.value.trim();
    if (/^[0-9]{0,10}$/.test(value)) {
      setFormData(prevState => ({
        ...prevState,
        phone: value
      }));
    }
  }

  const handleSubmit = () => {
    if (!selectedService.length || !date || !time) {
      toast.error('Por favor, selecciona al menos un servicio, fecha y hora antes de continuar.', {
        position: 'top-right',
        className: 'mt-5'
      });
      return;
    }
    console.log("Información a enviar:", {
      services: selectedService,
      date,
      time
    });
    setStep('information');
  };

  const handleConfirmation = () => {
    setShowModalC(true);
    setModalContent('preparing');
    setTimeout(() => {
      const selectedServiceObj = services.find(service => service.id === parseInt(selectedService));
      if (selectedServiceObj) {
        setModalContent(selectedServiceObj);
      }
    }, 2000);
  };

  const handleVerification = () => {
    axios.post(`${URLConnection}/users/verification-password`, { email: credentials.email.value, resetCode: parseInt(confirmationCode) })
      .then(response => {
        // Verificación exitosa, mostrar alerta y abrir el modal de confirmación de cita
        toast.success('Código de verificación correcto');
        setShowModal(false);
        handleConfirmation()
      })
      .catch(error => {
        // Verificación fallida, mostrar mensaje de error
        toast.warn('Error al verificar el código. Revise su correo!');
        // Puedes mostrar un mensaje de error al usuario aquí
      });
  };


  const realizarPago = async () => {
    const selectedServicesInfo = selectedService.map((serviceId) => {
      const service = services.find((service) => service.id === parseInt(serviceId));
      return {
        id: service.id,
        name: service.name,
        price: service.price,
      };
    });

    const info = {
      services: selectedServicesInfo,
      client: {
        name: formData.name,
        last_name1: formData.last_name1,
        last_name2: formData.last_name2,
        email: credentials.email.value,
        phone: formData.phone,
      },
      date,
      timeStart : timeSlot.start,
      timeEnd: timeSlot.end,
    };

    try {
      const response = await axios.post(`${URLConnection}/dates/createAppointment`, info);
      const init_point = response.data.data.body.init_point;
      window.location.href = init_point;
      // console.log(info)
    } catch (error) {
      console.error('Error al realizar pago:', error);
    }
  };

  return (
    <div className='py-5'>
      <div className='row'>
        <div className='col-md-6'>
          <img className='img-cita'
            src='https://jarturoonline.000webhostapp.com/maq-estetica/img/Cita.png' alt='foto'
          />
        </div>
        {step === 'agendar' && (
          <div className='col-md-4 formulario-cita'>
            <div className='bg-light p-4 rounded'>

              <h1 className='mb-4 fw-bold'>Agendar Cita</h1>
              <form >

                <div className='mb-3'>
                  <label htmlFor='servicio' className='form-label fw-bold'>Elije el Servicio(s) : </label>
                  <select id='servicio' className='form-select' value={''} onChange={(e) => {
                    const selectedServiceId = e.target.value;
                    if (!selectedService.includes(selectedServiceId)) {
                      setSelectedService([...selectedService, selectedServiceId]);
                    }
                  }}>
                    <option value=''>Selecciona un servicio</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>{service.name} - Costo : $ {(service.price).toFixed(2)}</option>
                    ))}
                  </select>
                  {selectedService.map((serviceId, index) => (
                    <div key={index} className="d-flex align-items-center">
                      <div>
                        <label>Horario para {services.find(service => service.id === parseInt(serviceId)).name}:</label>
                        <select value={time[serviceId] || ''} onChange={(e) => setTime({
                          ...time,
                          [serviceId]: e.target.value
                        })}>
                          <option className='form-control'>Selecciona un horario</option>
                          {availableTimes.map((timeSlot, index) => (
                            <option key={index} value={timeSlot.start}>{timeSlot.start} - {timeSlot.end}</option>
                          ))}
                        </select>
                      </div>
                      <button className="btn btn-danger ms-2 mt-3" onClick={() => removeSelectedService(serviceId)}>Eliminar</button>
                    </div>
                  ))}

                  <div className='mb-3'>
                    <label htmlFor='fecha' className='form-label fw-bold mt-3'>Fecha de la cita:</label>
                    <DatePicker
                      id='fecha'
                      selected={date}
                      onChange={date => setDate(date)}
                      filterDate={filterSunday}
                      minDate={new Date()} // Para evitar seleccionar fechas pasadas
                      showDisabledMonthNavigation
                      dateFormat='dd/MM/yyyy'
                      className='form-control'
                    />
                  </div>

                </div>
                <input className='btn btn-success' type='button'
                  value='Agendar Cita' onClick={handleSubmit}
                />
              </form>
            </div>
          </div>
        )}
        {step === 'information' && (
          <div className='col-md-4 formulario-cita'>
            <div className='col-12 text-left'>
              <i className='fa-solid fa-arrow-left'></i>
              <span onClick={() => setStep('agendar')} className=' btn btn-link text-decoration-none text-reset back-link hover'>
                Regresar
              </span>
            </div>
            <div className='bg-light p-3 rounded'>
              <h3 className='mb-2 fw-bold'>Información Personal</h3>
              <form>
                <div className='mb-3'>
                  <label htmlFor='nombre' className='form-label fw-bold'>Nombre:</label>
                  <input id='nombre' className='form-control' type='text' placeholder='Nombre' value={formData.name} onChange={(e) => handleChange(e, 'name')} />
                </div>
                <div className='mb-3'>
                  <label htmlFor='apellidos' className='form-label fw-bold'>Apellidos:</label>
                  <div className='row'>
                    <div className='col'>
                      <input id='apellidoPaterno' className='form-control' type='text' placeholder='Apellido Paterno' value={formData.last_name1} onChange={(e) => handleChange(e, 'last_name1')} />
                    </div>
                    <div className='col'>
                      <input id='apellidoMaterno' className='form-control' type='text' placeholder='Apellido Materno' value={formData.last_name2} onChange={(e) => handleChange(e, 'last_name2')} />
                    </div>
                  </div>
                </div>
                <div className='mb-3'>
                  <label htmlFor='telefono' className='form-label fw-bold'>Número de Teléfono:</label>
                  <input id='telefono' className='form-control' type='tel' placeholder='Número de Teléfono' value={formData.phone} onChange={validationPhone} minLength={10} />
                </div>
                <div className='mb-3'>
                  <div className='form-group mb-2'>
                    <label htmlFor='email' className='form-label fw-bold'>
                      Correo Electronico
                    </label>
                    <input
                      className={`form-control ${credentials.email.hasError ? 'is-invalid' : ''}`}
                      placeholder='Correo Electronico'
                      id='email'
                      type='email'
                      name='email'
                      value={credentials.email.value}
                      onChange={handleChangeEmail}
                      onBlur={handleBlur}
                      aria-errormessage='emailErrorID'
                      aria-invalid={credentials.email.hasError}
                    />
                    <p
                      id='msgID'
                      aria-live='assertive'
                      className='invalid-feedback'
                      style={{ visibility: credentials.email.hasError ? 'visible' : 'hidden' }}
                    >
                      Ingresa un Correo Válido
                    </p>
                  </div>
                </div>
                <button className='btn btn-success' type='button' onClick={() => setShowModal(true)}>Confirmar</button>

                <div className='mt-2'>
                  <p className='mb-0 text-align-center'>¿Ya tienes una cuenta?
                    <Link to='/Login/register' className='fw-bold p-2 text-decoration-none'>Ingresa aquí</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <CustomModal
        show={showModal}
        centered
        onHide={() => setShowModal(false)}
        title={modalContent === 'confirmCode' ? 'Confirmando correo...' : 'Validación del correo'}
      >
        {modalContent === 'confirmCode' ? (
          <p>Espere, Enviando codigo de confirmación...</p>
        ) : (
          <>
            <p>Introduce el código de verificación que has recibido en tu correo electrónico:</p>
            <input type="text" placeholder="Código de verificación" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} />
            <button className="btn btn-primary mt-2" onClick={handleVerification}>Confirmar</button>
          </>

        )}
      </CustomModal>

      <CustomModal
        show={showModalC}
        centered
        onHide={() => setStep('information')}
        title={modalContent === 'preparing' ? 'Preparando el proceso de pago...' : 'Agendar Lugar'}
      >
        {modalContent === 'preparing' ? (
          <p>Por favor, espera un momento mientras preparamos tu compra...</p>
        ) : (
          <>
            <div className="px-4">
              <h5 className="text-uppercase text-center fs-5">{formData.name} {formData.last_name1} {formData.last_name2}</h5>
              <div className='d-flex'>
                <label className='form-label title fw-bold'>Email :</label>
                <span className="theme-color">{credentials.email.value}</span>
              </div>
              <div className='d-flex'>
                <span className="theme-color"> No. Celular: {formData.phone} </span>
              </div>
              <div className="mb-3">
                <hr className="new1" />
              </div>
              {selectedService.map((serviceId) => {
                const service = services.find((service) => service.id === parseInt(serviceId));
                const totalAmount = service.price / 2;
                return (
                  <div key={serviceId}>
                    <div className="d-flex justify-content-between">
                      <span className="font-weight-bold">Servicio ({service.name}) :</span>
                      <span className="text-muted">$ {(service.price).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small>Anticipo del :</small>
                      <small>$ {totalAmount.toFixed(2)}</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small>Restante a pagar :</small>
                      <small>$ {totalAmount.toFixed(2)}</small>
                    </div>
                    <div className="mb-3">
                      <hr className="new1" />
                    </div>
                  </div>
                );
              })}
              <div className="d-flex justify-content-between mt-3">
                <span className="font-weight-bold">Total a pagar :</span>
                <span className="font-weight-bold theme-color">
                  $ {selectedService.reduce((total, serviceId) => {
                    const service = services.find((service) => service.id === parseInt(serviceId));
                    return total + (service.price / 2);
                  }, 0).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="text-center mt-5">
              <button className="btn btn-primary" onClick={realizarPago}>Realizar pago</button>
            </div>
          </>
        )}
      </CustomModal>


    </div >
  )
}

export default AgendarCita
