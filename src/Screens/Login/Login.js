import React from 'react';
import '../../CSS/NavBar.css';
import '../../CSS/Login.css';
import { Link } from 'react-router-dom';
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
    const passwordHasError = credentials.password.value.length < minPassword;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      email: {
        ...prevCredentials.email,
        hasError: emailHasError,
      },
      password: {
        ...prevCredentials.password,
        hasError: passwordHasError,
      },
    }));
  }

  return (
    <div className='wrapper d-flex align-items-center justify-content-center w-200 mt-4'>
      <div className='login rounded align-text-center'>
        <h2 className='mb-3 text-center'>Inicio de Sesión</h2>
        <form className='needs-validation'>
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
              className={`form-control ${credentials.password.hasError ? 'is-invalid' : ''}`}
              type='password'
              name='password'
              value={credentials.password.value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {credentials.password.hasError && (
              <div className='invalid-feedback'>
                La contraseña debe tener al menos {minPassword} caracteres.
              </div>
            )}
          </div>
          <div>
            <button type='button ' className='btn btn-success mt-2'>
              Iniciar sesión
            </button>
            <Link to='Recuperacion' className='fw-bold p-3 d-block text-decoration-none'>¿Olvidaste tu Contraseña?</Link>
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
