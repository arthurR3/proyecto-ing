import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const emailRegexp = new RegExp(/[^@\t\r\n]+@[^@\t\r\n]+\.[^@\t\r\n]+/);

function Recuperacion() {
    const navigation = useNavigate();
    const [credentials, setCredentials] = useState({
        email: {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!credentials.email.value) {
            toast.error('Ingrese un correo electronico por favor!', {
                position: 'bottom-center',
                className: 'p-2'
            })
            return;
        };

        axios.post("https://back-estetica.up.railway.app/api/v1/users/recover-password", {
            email: credentials.email.value
        })
            .then(response => {
                if (response.data.success) {
                    toast.success(response.data.message, {
                        position: 'top-right',
                        className: 'mt-5'
                    })
                    navigation(`/verify-email/${credentials.email.value}`);
                }
                else {
                    const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                    toast.error('Ingreso fallido. ' + errorMessage, {
                        position: 'top-center',
                        className: 'mt-5'
                    });
                }
            })
            .catch(error => {
                console.log('error ', error.response)
                if (error.response) {
                    if (error.response.status === 402) {
                        // Error específico de registro existente
                        toast.warn(error.response.data.message, {
                            position: 'top-center',
                            className: 'mt-5'
                        });
                    } else {
                        // Otro tipo de error del servidor
                        alert('Error del servidor: ' + error.response.message);
                    }
                } else if (error.message.toLowerCase() === 'network error') {
                    // Error de red, no hay conexión al servidor
                    console.warn(error.message);
                    alert('El Servidor no esta funcionando. Intente mas tarde', error.message);
                } else {
                    // Otro tipo de error que no es del servidor (puede ser local)
                    console.log('Error:', error.message);
                    alert('Error inesperado. Por favor, inténtalo de nuevo más tarde.');

                }
            })
    }




return (
    <div className=' mt-auto m-5 d-flex align-items-center justify-content-center'>
        <div className='login rounded align-text-center'>
            <h2 className='mb-3 text-center pb-5'>Recuperación de Contraseña</h2>
            <form className='needs-validation'>
                <div className='form-group mb-2'>
                    <label htmlFor='email' className='form-label fw-bold'>
                        Correo Electronico
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
                <div className="d-flex">
                    <button type='submit' onClick={handleSubmit} className='btn btn-success me-2'>
                        <i className='fa fa-envelope me-2'></i>
                        Enviar Codigo
                    </button>
                    <Link to="/login" className='btn btn-secondary'>
                        Cancelar
                    </Link>
                </div>

            </form>
        </div>
    </div>
)}
export default Recuperacion