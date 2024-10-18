import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import ApiConnection from '../../../Components/Api/ApiConfig';
import useLoginForm from '../../../hooks/useLoginForm.js'
import { useAuth } from '../../../Components/Context/AuthContext.js';
import ForgetedPass from '../../../features/Login/ForgetPassword.js';
const URLConnection = ApiConnection();

const Login = () => {
  const toast = useRef(null)
  const navigate = useNavigate();
  const {authToken} = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [isRecaptcha, setRecaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const initialState = {
    email: { value: '', hasError: false },
    password: { value: '', hasError: false },
  };

  const { credentials, handleChange, handleBlur } = useLoginForm(initialState, 8);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!credentials.email.value || !credentials.password.value || !isRecaptcha) {
      setLoading(false);
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Completa todos los campos.', life: 3000 });
      return;
    }

    axios.post(`${URLConnection}/users/login`, {
      email: credentials.email.value,
      password: credentials.password.value
    })
      .then(response => {
        if (response.data.success) {
          authToken(response.data.data);
          toast.current.show({ severity: 'success', summary: 'Inicio Exitoso!', detail: 'Bienvenido! Inicio correctamente', life: 2500 });
          setTimeout(() => navigate('/'), 3000);
        } else {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ingreso Fallido ' + response.data.message, life: 3000 });
        }
      })
      .catch(error => {
        handleError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401 || status === 403) {
        toast.current.show({ severity: 'warn', summary: 'Credenciales Incorrectas', detail:data.message, life: 3000 });

      } else {
        toast.current.show({ severity: 'warn', summary: 'Credenciales Incorrectas', detail:data.message, life: 3000 });
      }
    } else if (error.message.toLowerCase() === 'network error') {
      alert('Error de red. Verifica tu conexión a Internet.');
    } else {
        toast.current.show({ severity: 'warn', summary: 'Credenciales Incorrectas', detail:'Intente mas tarde!', life: 3000 });
    }
  };

  return (
    <div>
    <div className=' flex flex-col h-auto'>
    <div className='flex items-center justify-center w-full mt-4'>
      <Toast ref={toast}/>
      <div className='bg-white shadow-lg border-2 rounded-lg p-6 w-full max-w-lg'>
        <div class="flex flex-col mb-5 space-y-1">
          <h3 class="whitespace-nowrap tracking-tight text-2xl font-bold text-purple-700">Iniciar Sesión</h3>
          <p class="text-sm text-muted-foreground">
            Ingresa tu correo electrónico y contraseña para acceder a tu cuenta.
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='form-group'>
            <label htmlFor='email' className='block text-sm text-purple-700 font-semibold mb-2'>
              Correo electrónico
            </label>
            <input
              id='email'
              type='email'
              name='email'
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${credentials.email.hasError ? 'border-red-500' : ''}`}
              value={credentials.email.value}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-errormessage='emailErrorID'
              aria-invalid={credentials.email.hasError}
            />
            {credentials.email.hasError && (
              <p id='msgID' className='text-red-500 text-sm mt-1'>
                Ingresa un Correo Válido
              </p>
            )}
          </div>
          <div className='form-group'>
            <label htmlFor='password' className='block text-sm text-purple-700 font-semibold mb-2'>
              Contraseña
            </label>
            <div className='relative'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                name='password'
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                value={credentials.password.value}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <ReCAPTCHA
            sitekey="6LcHuV0pAAAAAITzNPOb8TaIRX4UEI3w9XHYB9IM"
            onChange={() => setRecaptcha(true)}
            className='pt-2'
          />

          <button
            type='submit'
            className={`btn btn-success mt-2 p-5 bg-green-600 text-white py-2 rounded-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i> Ingresando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket mr-2"></i> Iniciar sesión
              </>
            )}
          </button>

          <Link
          onClick={() => setIsModalOpen(true)}
            className='block text-left text-blue-500 font-bold p-2'
          >
            ¿Olvidaste tu Contraseña?
          </Link>
          <div className='mt-3'>
            <p className='mb-0'>
              ¿Aun no tienes cuenta?
              <Link to='/Login/register' className='text-blue-500 font-bold p-2'>
                Crear Cuenta
              </Link>
            </p>
          </div>
        </form>
      </div>
      {isModalOpen && <ForgetedPass onClose={() => setIsModalOpen(false)}/>}
    </div>
    </div>
    </div>
  );
};

export default Login;
