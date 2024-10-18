import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ApiConnection from '../../../../Components/Api/ApiConfig';

const URLConnection = ApiConnection();

function ValidationEmail() {
    const navigate = useNavigate();
    const toast = useRef(null)
    const { method, correo } = useParams();
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setVerificationCode(event.target.value);
    };

    const resetEmail = async () => {
        axios.post(`${URLConnection}/users/recover-password`, {
            email: correo
        })
            .then(response => {
                if (response.data.success) {
                    toast.current.show({ severity: 'success', summary: 'Exitoso', detail: response.data.message, life: 3000 });
                }
            });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!verificationCode.trim()) {
            toast.current.show({ severity: 'warn', summary: 'Invalido', detail: 'Ingrese un codigo válido', life: 3000 });
            return;
        }

        setLoading(true);
        let endPoint;

        if (verificationCode.length === 5) {
            if (method === 'code') {
                endPoint = `/Login/change/change-password/${correo}`;
            } else if (method === 'secret') {
                endPoint = `/Login/recuperacion/recuperacion/secret-question/${correo}`;
            }

            axios.post(`${URLConnection}/users/verification-password`, {
                email: correo,
                resetCode: parseInt(verificationCode)
            })
                .then(response => {
                    if (response.data.success) {
                        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: response.data.message, life: 3000 });
                        navigate(endPoint);
                    } else {
                        const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                        toast.current.show({ severity: 'error', summary: 'Error', detail:'Codigo Fallido ' + errorMessage, life: 3000 });
                    }
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 403) {
                            toast.current.show({ severity: 'warn', summary: 'Warning', detail:error.response.data.message, life: 3000 });
                        } else {
                            alert('Error del servidor: ' + error.response.message);
                        }
                    } else if (error.message.toLowerCase() === 'network error') {
                        alert('Error de red. Por favor, verifica tu conexión a Internet.', error.message);
                    } else {
                        alert('Error inesperado. Por favor, inténtalo de nuevo más tarde.');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'El código debe ser de 5 digitos', life: 2000 });
            setLoading(false);
        }
    };

    return (
        <div className='rounded-lg border bg-white shadow-sm max-w-md mx-auto p-4 md:p-6'>
            <Toast ref={toast} />
            <div className='flex flex-col space-y-1.5'>
                <h3 className='text-2xl font-semibold text-purple-600 leading-none tracking-tight'>Verificar Código</h3>
                <p className='text-md text-gray-400'>Ingresa el código de verificación que te enviamos.</p>
            </div>
            <div className='md:p-6 md:mt-4 space-y-4'>
                <form onSubmit={handleSubmit} className='needs-validation'>
                    <div className='form-group mb-2'>
                        <input
                            type='text'
                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            placeholder='Ingrese el código de verificación'
                            value={verificationCode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            type='submit'
                            className='inline-flex items-center rounded-md gap-2 text-lg font-medium ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-green-500 text-white hover:bg-green-600/90 transition-colors'
                            disabled={loading}
                        >
                            {loading ? (
                                <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                                <>
                                    <i className="fa-solid fa-circle-check"></i> Verificar
                                </>
                            )}
                        </button>
                        <Link to="/login" className='inline-flex items-center rounded-md text-lg font-medium ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-slate-300 text-gray-500 hover:bg-gray-600/90 hover:text-white transition-colors'>
                            Cancelar
                        </Link>
                    </div>
                    <div className="mt-4">
                        <Link
                            onClick={resetEmail}
                            className='text-md text-blue-600 hover:none hover:text-purple-500 cursor-pointer'
                        >
                            Reenviar código
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ValidationEmail;
