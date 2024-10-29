import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import ApiConnection from '../../../../Components/Api/ApiConfig';
import useLoginForm from '../../../../hooks/useLoginForm';

const URLConnection = ApiConnection();
const emailRegexp = new RegExp(/[^@\t\r\n]+@[^@\t\r\n]+\.[^@\t\r\n]+/);

function ForEmail() {
    const navigation = useNavigate();
    const { method } = useParams();
    const [isRecaptcha, setRecaptcha] = useState(false);
    const initialState = {
        email: { value: '', hasError: false },
        password: { value: '', hasError: false },
      };
    
      const { credentials, handleChange, handleBlur } = useLoginForm(initialState, 8);

    const handleRecaptcha = () => {
        setRecaptcha(true);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!credentials.email.value) {
            toast.error('Ingrese un correo electronico por favor!', {
                position: 'bottom-center',
                className: 'p-2',
            });
            return;
        }
        if (!isRecaptcha) {
            toast.info('Por favor, resuelve el reCAPTCHA antes de inciar sesión');
            return;
        }

        axios.post(`${URLConnection}/users/recover-password`, {
            email: credentials.email.value,
        })
            .then((response) => {
                if (response.data.success) {
                    toast.success(response.data.message, {
                        position: 'top-right',
                        className: 'mt-5',
                    });
                    navigation(`/login/verificacion/verify-email/${method}/${credentials.email.value}`);
                } else {
                    const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                    toast.error('Ingreso fallido. ' + errorMessage, {
                        position: 'top-center',
                        className: 'mt-5',
                    });
                }
            })
            .catch((error) => {
                console.log('error ', error.response);
                if (error.response) {
                    if (error.response.status === 402) {
                        toast.warn(error.response.data.message, {
                            position: 'top-center',
                            className: 'mt-5',
                        });
                    } else {
                        alert('Error del servidor: ' + error.response.message);
                    }
                } else if (error.message.toLowerCase() === 'network error') {
                    console.warn(error.message);
                    alert('El Servidor no esta funcionando. Intente mas tarde', error.message);
                } else {
                    console.log('Error:', error.message);
                    alert('Error inesperado. Por favor, inténtalo de nuevo más tarde.');
                }
            });
    };

    return (
        <div className='flex justify-center items-center mt-10 mx-5'>
            <div className='bg-white shadow-lg border-2 rounded-lg p-6'>
                <h2 className='text-2xl font-bold text-center mb-6'>Recuperación de Contraseña</h2>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                            Correo Electrónico
                        </label>
                        <input
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${credentials.email.hasError ? 'border-red-500' : 'border-gray-300'
                                }`}
                            id='email'
                            type='email'
                            name='email'
                            value={credentials.email.value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-errormessage='emailErrorID'
                            aria-invalid={credentials.email.hasError}
                        />
                        {credentials.email.hasError && (
                            <p
                                id='msgID'
                                aria-live='assertive'
                                className='mt-2 text-sm text-red-600'
                            >
                                Ingresa un Correo Válido
                            </p>
                        )}
                    </div>
                    <ReCAPTCHA sitekey="6LcHuV0pAAAAAITzNPOb8TaIRX4UEI3w9XHYB9IM" onChange={handleRecaptcha} className='pt-2 mb-3' />
                    <div className='flex space-x-4'>
                        <button type='submit'  className='btn btn-success bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600'>
                            <i className='fa fa-envelope mr-2'></i>
                            Enviar Codigo
                        </button>
                        <Link to="/login" className='btn btn-secondary bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600'>
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForEmail;
