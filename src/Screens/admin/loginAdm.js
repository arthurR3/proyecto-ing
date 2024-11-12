import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import ReCAPTCHA from 'react-google-recaptcha';
import ApiConnection from '../../Components/Api/ApiConfig';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../Components/Context/AdminAuthContext';

const URLConnection = ApiConnection();

const AdminLogin = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { setAdminAuthToken } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isRecaptcha, setRecaptcha] = useState(false);
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    email: { value: '', hasError: false },
    password: { value: '', hasError: false },
  });

  useEffect(() => {
    return () => {
      // Cleanup en desmontaje
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: { value, hasError: false }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!credentials.email.value || !credentials.password.value || !isRecaptcha) {
      setLoading(false);
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Completa todos los campos.', life: 3000 });
      return;
    }

    try {
      const response = await axios.post(`${URLConnection}/users/loginAdmin`, {
        email: credentials.email.value,
        password: credentials.password.value
      });

      if (response.data.success) {
        setAdminAuthToken(response.data.data);
        toast.current.show({ severity: 'success', summary: 'Inicio Exitoso!', detail: 'Bienvenido, Administrador!', life: 2500 });
        setTimeout(() => navigate('/admin/home'), 3000);
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ingreso fallido: ' + response.data.message, life: 3000 });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      toast.current.show({ severity: 'warn', summary: 'Error', detail: data.message || 'Error inesperado.', life: 3000 });
    } else {
      toast.current.show({ severity: 'error', summary: 'Error de Red', detail: 'Verifica tu conexión a Internet.', life: 3000 });
    }
  };

  return (
    <div className='flex flex-col h-auto'>
      <div className='flex items-center justify-center w-full mt-4'>
        <Toast ref={toast} />
        <div className='bg-white shadow-lg border-2 rounded-lg p-6 w-full max-w-lg'>
          <h3 className='text-2xl font-bold text-purple-700 mb-5'>Login Administrador</h3>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='form-group'>
              <label htmlFor='email' className='block text-sm text-purple-700 font-semibold mb-2'>
                Correo electrónico
              </label>
              <input
                id='email'
                type='email'
                name='email'
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${credentials.email.hasError ? 'border-red-500' : ''}`}
                value={credentials.email.value}
                onChange={handleChange}
              />
              {credentials.email.hasError && (
                <p className='text-red-500 text-sm mt-1'>Ingresa un correo válido</p>
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
                  className='flex h-10 w-full rounded-md border px-3 py-2 text-sm'
                  value={credentials.password.value}
                  onChange={handleChange}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <ReCAPTCHA
                sitekey="6LcHuV0pAAAAAITzNPOb8TaIRX4UEI3w9XHYB9IM"
                onChange={() => setRecaptcha(true)}
              className='mt-4'
            />

            <button
              type='submit'
              className={`mt-8 p-5 bg-green-600 text-white py-2 rounded-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className='fa-solid fa-spinner animate-spin'></i> Ingresando...
                </>
              ) : (
                <>
                  <i className='fa-solid fa-right-to-bracket mr-2'></i> Acceder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
