import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom'

function ValidationEmail() {
    const navigation = useNavigate();
    let { correo } = useParams();
    const [verificationCode, setVerificationCode] = useState('');

    const handleChange = (event) => {
        setVerificationCode(event.target.value);
    };

    const resetEmail = async (e) =>{
        axios.post("http://localhost:5000/api/v1/users/recover-password", {
            email: correo
        })
            .then(response => {
                if (response.data.success) {
                    toast.success(response.data.message, {
                        position: 'top-right',
                        className: 'mt-5'
                    })
                    return;
                }
            })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!verificationCode.trim()) {
            toast.error('Ingrese un código de verificación válido');
            return;
        }
        if (verificationCode.length === 5) {

            axios.post("http://localhost:5000/api/v1/users/verification-password", {
                email: correo,
                resetCode: parseInt(verificationCode)
            })
                .then(response => {
                    if (response.data.success) {
                        console.log(response.data.success)
                        toast.success(response.data.message, {
                            position: 'top-right',
                            className: 'mt-5',
                        })
                        navigation(`/change-password/${correo}`)
                    } else {
                        const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                        toast.error('Ingreso fallido. ' + errorMessage, {
                            position: 'top-center',
                            className: 'mt-5'
                        });
                    }
                })
                .catch(error => {
                    
                    if (error.response) {
                        if (error.response.status === 403) {
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
                        alert('Error de red. Por favor, verifica tu conexión a Internet.', error.message);
                    } else {
                        // Otro tipo de error que no es del servidor (puede ser local)
                        console.log('Error:', error.message);
                        alert('Error inesperado. Por favor, inténtalo de nuevo más tarde.');

                    }
                })
        } else {
            toast.error('El codigo de verificacion es de 5 digitos. Intente de nuevo.', {
                position: 'top-right',
                className: 'mt-5'
            })
            return;
        }
    };

    return (
        <div className='mt-auto m-5 d-flex align-items-center justify-content-center'>
            <div className='login rounded align-text-center'>
                <h2 className='mb-3 text-center pb-5'>Código de Verificación</h2>
                <form onSubmit={handleSubmit} className='needs-validation'>
                    <div className='form-group mb-2'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Ingrese el código de verificación'
                            value={verificationCode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-flex">

                        <button type='submit' className='btn btn-success me-2'>
                            Enviar
                        </button>
                        <Link className='fw-bold p-2 d-block text-decoration-none ' onClick={resetEmail}>Reenviar codigo</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ValidationEmail;
