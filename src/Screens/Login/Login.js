import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import SessionStorage from '../../Componentes/sessionStorage';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import '../../CSS/NavBar.css';
import '../../CSS/Login.css';
import CustomModal from '../../Componentes/Modal';
import { GoogleLogin } from '@react-oauth/google';
const URLConnection = ApiConnection();
const emailRegexp = new RegExp(/[^@\t\r\n]+@[^@\t\r\n]+\.[^@\t\r\n]+/);

const Login = () => {
  const navigation = useNavigate();
  const minPassword = 8;
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryMethod, setRecoveryMethod] = useState('');
  const [showPassword, setShowPassword] = useState('')
  const [isRecaptcha, setRecaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: {
      value: '',
      hasError: false,
    },
    password: {
      value: '',
      hasError: false,
    },
  });
  const handleRecaptcha = () => {
    setRecaptcha(true)
  }

  const handleOpenRecoveryModal = () => {
    setShowRecoveryModal(true);
  };

  const handleCloseRecoveryModal = () => {
    setShowRecoveryModal(false);
  };

  const handleRecoverPassword = (method) => {
    handleCloseRecoveryModal();
    navigation(`/Login/recuperacion/recover-password/${method}`);
  };


  function handleChange(evt) {
    const { name, value } = evt.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: {
        value,
        hasError: name === 'password' && value.length < minPassword,
      },
    }));
  }
  function handleError() {
    console.log('Login failed');
  }

  function handleSuccess(credentialsResponse) {
    console.log(credentialsResponse)
  }

  /*
      De manera síncrona valuó si el valor del campo no es un correo valido y evita
      que el usuario reciba un error sin haber terminado de poner el valor.
    */

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

  const handleSubmit = (e) => {
    setLoading(true)
    e.preventDefault();
    if (!credentials.email.value || !credentials.password.value) {
      setLoading(false)
      toast.error('No deje ningun campo vacio', {
        position: 'bottom-center',
        className: 'p-2'
      })
      return;
    }
    if (!isRecaptcha) {
      setLoading(false)
      toast.info('Por favor, resuelve el reCAPTCHA antes de inciar sesión');
      return;
    }
    axios.post(`${URLConnection}/users/login`, {
      email: credentials.email.value,
      password: credentials.password.value
    })
      .then(response => {
        setLoading(true)
        const data = response.data.data;
        if (response.data.success) {
          setTimeout(()=>{
            toast.success(`Inicio exitoso`, {
              position: "top-right",
              className: "mt-5"
            })
            setTimeout(() => {
              window.location.reload()
            }, 100)
            SessionStorage.saveSession(data);
            navigation('/');
          }, 2000)
          /* console.log("Inicio exitoso") */

        } else {
          setLoading(false)
          const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
          toast.error('Ingreso fallido. ' + errorMessage);
        }
      })
      .catch(error => {
        setLoading(false)
        if (error.response) {
          // El servidor respondió con un error
          if (error.response.status === 401) {
            // Error específico de registro existente
            toast.warn(error.response.data.message, {
              position: 'top-right',
              className: 'mt-5'
            });
          } if (error.response.status === 403) {
            toast.error(error.response.data.message, {
              position: 'top-right',
              className: 'mt-5'
            });
          }
        } else {
          if (error.message.toLowerCase() === 'network error') {
            // Error de red, no hay conexión al servidor
            alert('Error de red. Por favor, verifica tu conexión a Internet.', error.message);
          } else {
            // Otro tipo de error que no es del servidor (puede ser local)
            console.log('Error:', error.message);
            toast.error('Error inesperado. Por favor, inténtalo de nuevo más tarde.');
          }
        }
      })

  }

  return (
    <div className='wrapper d-flex align-items-center justify-content-center w-100 mt-4'>
      <div className='login rounded align-text-center'>
        <h2 className='mb-3 text-center  fw-bold'>Inicio de Sesión</h2>
        <form className='needs-validation'>
          <div className='form-group mb-2'>
            <div>
              <GoogleLogin useOneTap onError={handleError} onSuccess={handleSuccess} />
            </div>
            <label htmlFor='email' className='form-label fw-bold'>
              Correo
            </label>
            <input
              className={`form-control ${credentials.email.hasError ? 'is-invalid' : ''}`}
              id='email'
              type='email'
              name='email'
              value={credentials.email.value}
              onChange={handleChange}
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
          <div className='form-group mb-2'>
            <label htmlFor='contrasena' className='form-label fw-bold'>
              Contraseña
            </label>
            <div className="input-group">
              <input
                id='password'
                className={`form-control`}
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={credentials.password.value}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
          </div>


          <div>
            <ReCAPTCHA sitekey="6LcHuV0pAAAAAITzNPOb8TaIRX4UEI3w9XHYB9IM" onChange={handleRecaptcha} className='pt-2' />
            <button type='submit' onClick={handleSubmit} className={`btn btn-success mt-2 ${loading ? 'loading' : ''}`} disabled={loading}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {loading ? (
                <div className="progress-container">
                  <i className="fa-solid fa-spinner"></i>  Ingresando...
                  <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}></div>
                </div>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket me-3"></i>
                  Iniciar sesión
                </>
              )}
            </button>
            <Link onClick={handleOpenRecoveryModal} className='fw-bold p-2 d-block text-decoration-none'>¿Olvidaste tu Contraseña?</Link>
            <div className='mt-3'>
              <p className='mb-0 text-align-center'>¿Aun no tienes cuenta?
                <Link to='/Login/register' className='fw-bold p-2 text-decoration-none'>Crear Cuenta</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
      <CustomModal
        show={showRecoveryModal}
        onHide={handleCloseRecoveryModal}
        title="Recuperar Contraseña"
      >
        <div>
          <h5>Selecciona el método de recuperación</h5>
          <div className='d-flex justify-center-between'>
            <button className='btn btn-primary me-2' onClick={() => handleRecoverPassword('code')}>Código de Verificación</button>
            <button className="btn btn-primary" onClick={() => handleRecoverPassword('secret')}>Pregunta Secreta</button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default Login;
