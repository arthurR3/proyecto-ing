import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom'
import ApiConnection from '../../../Componentes/Api/ApiConfig';
const URLConnection = ApiConnection();

function PreguntaSecreta() {
    const navigation = useNavigate();
    let { correo } = useParams();
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');
    const [validando, setValidando] = useState(false);

    useEffect(() => {
        // Se consulta la pregunta secreta del usuario
        axios.post(`${URLConnection}/users/verifcation-question`, { email: correo })
            .then(response => {
                setPregunta(response.data.question)
            })
            .catch(err => {
                toast.error('Error al obtener la pregunta secreta del usuario ', err);
            })
    }, [correo])

    const handleChange = (event) => {
        setRespuesta(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!respuesta.trim()) {
            toast.error('Complete el campo deseado.');
            return;
        }

        axios.post(`${URLConnection}/users/verification-answer`, {
            email: correo,
            answer: respuesta
        })
            .then(response => {
                if (response.data.success) {
                    // Respuesta correcta, redirigir al cambio de contraseña
                    toast.success(response.data.message, {
                        position: 'top-right',
                        className: 'mt-5',
                    })
                    navigation(`/Login/change/change-password/${correo}`);
                } else {
                    // Respuesta incorrecta, mostrar mensaje de error
                    const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                    toast.error('Ingreso fallido. ' + errorMessage, {
                        position: 'top-center',
                        className: 'mt-5'
                    });
                }
            })
            .catch(error => {
                // Manejo de errores
                if (error.response) {
                    if (error.response.status === 404 || 403) {
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
            });
    };


    return (
        <div className='mt-auto m-5 d-flex align-items-center justify-content-center'>
            <div className='login rounded align-text-center'>
                <h2 className='mb-3 fw-bold text-center p-2'>Recuperación por Pregunta Secreta</h2>
                <h4 className='text-black'>{pregunta}</h4>
                <form onSubmit={handleSubmit} className='needs-validation'>
                    <div className='form-group mb-2'>
                        <label htmlFor="hola">Ingresa tu respuesta</label>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Ingresa la respuesta que ingresaste al momento del registro'
                            value={respuesta}
                            onChange={handleChange}
                            disabled={validando}
                        />
                    </div>
                    <div className="d-flex">
                        <button type='submit' disabled={validando} className='btn btn-success me-2'>
                            {validando ? 'Validando...' : 'Enviar'}
                        </button>
                        <Link to={`/Login/verificacion/verify-email/${correo}`} className='btn btn-secondary'>
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PreguntaSecreta;
