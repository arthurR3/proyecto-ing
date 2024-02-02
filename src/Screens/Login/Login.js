import React from 'react';
import '../../CSS/NavBar.css';
import '../../CSS/Login.css';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
const emailRegexp = new RegExp(/[^@\t\r\n]+@[^@\t\r\n]+\.[^@\t\r\n]+/);

const Login = () => {
  const minPassword = 8;

  const [credentials, setCredentials] = React.useState({
    email: {
      value: '',
      hasError: false,
    },
    password: {
      value: '',
      hasError: false,
    },
  });

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
    e.preventDefault();
    if (!credentials.email.value || !credentials.password.value) {
      alert('No deje ningun campo en blanco');
      return;
    }
      axios.post("http://localhost:5000/api/v1/users/login", {
        email: credentials.email.value,
        password: credentials.password.value
      })
      .then(response =>{
        console.log("Response ", response.data);
        if(response.data.success){
          alert('Inicio exitoso')
          console.log("Registro exitoso")
        }else {
          const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
          alert('Registro fallido. ' + errorMessage);
      }
      })
      .catch(error =>{
        if (error.response) {
          // El servidor respondió con un error
          if (error.response.status === 401) {
              // Error específico de registro existente
              alert('El correo ya está registrado. Favor de utilizar otro correo.');
          } else {
              // Otro tipo de error del servidor
              alert('Error del servidor: ' + error.response.message);
          }
      } else if (error.message.toLowerCase() === 'network error') {
          // Error de red, no hay conexión al servidor
          console.warn(error.message);
          alert('Error de red. Por favor, verifica tu conexión a Internet.',error.message);
      } else {
          // Otro tipo de error que no es del servidor (puede ser local)
          console.log('Error:', error.message);
              alert('Error inesperado. Por favor, inténtalo de nuevo más tarde.');
          }
      })
    
  }

  return (
    <div className='wrapper d-flex align-items-center justify-content-center w-100 mt-4'>
      <div className='login rounded align-text-center'>
        <h2 className='mb-3 text-center'>Inicio de Sesión</h2>
        <form className='needs-validation' onSubmit={handleSubmit}>
          <div className='form-group mb-2'>
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
            <input
              id='password'
              className={`form-control`}
              type='password'
              name='password'
              value={credentials.password.value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <button type='submit' onClick={handleSubmit} className='btn btn-success mt-2'>
              Iniciar sesión
            </button>
            <ReCAPTCHA sitekey="6LcHuV0pAAAAAITzNPOb8TaIRX4UEI3w9XHYB9IM" className='pt-2' />
            <Link to='/login/recuperacion' className='fw-bold p-2 d-block text-decoration-none'>¿Olvidaste tu Contraseña?</Link>
            <div className='mt-3'>
              <p className='mb-0 text-align-center'>¿Aun no tienes cuenta?
                <Link to='/register' className='fw-bold p-2 text-decoration-none'>Crear Cuenta</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
