import React, { useState } from 'react'
import ApiConnection from '../../Components/Api/ApiConfig.js'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Encuesta from '../Encuesta/Encuesta.js';

const URLConnection = ApiConnection();

const ConfirmateEmail = ({ data, idUser, verification, metodo, resendVerification, onBack }) => {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', ''])
    const navigation = useNavigate()
    console.log(idUser)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false) // Estado para el proceso de registro
    const [registerError, setRegisterError] = useState(null);
    const [showSurvey, setShowSurvey] = useState(false);

    const handleCodeChange = (index, value) => {
        const newCode = [...verificationCode]
        newCode[index] = value
        setVerificationCode(newCode)

        if (value && index < 4) {
            const nextInput = document.getElementById(`code-${index + 1}`)
            nextInput?.focus()
        }
    }
    const handleSurveyComplete = () => {
        verification({ status: true, message: 'Gracias por sus respuestas. Buen día!' })
        setTimeout(() => {
            setShowSurvey(false); // Ocultar la encuesta después de completarla
            navigation(-2); // Navegar fuera del proceso
        }, 1000)
    };


    const RealizarPago = async () => {
        setIsRegistering(true);
        setRegisterError(null);
        try {
            if (metodo === 'full') {
                const response = await axios.post(`${URLConnection}/dates/create-sinpay`, data);
                //const response = { status: true }

                await new Promise(resolve => setTimeout(resolve, 4000));
                if (response.status) {
                    verification({ status: true, message: 'Cita registrada con éxito' })
                    setTimeout(() => {
                        setShowSurvey(true);
                        setIsRegistering(false);
                    }, 1000)

                } else {
                    setRegisterError('Error al procesar la cita. Intente nuevamente.');
                    setIsRegistering(false)
                }
            } else if (metodo === 'deposit') {
                const response = await axios.post(`${URLConnection}/dates/create-order`, data);
                setIsRegistering(false);
                const init_point = response.data.url;
                window.location.href = init_point
            }

        } catch (error) {
            setIsRegistering(false)
            throw new Error('Error al procesar el pago', error);
        }
    };

    const verficateEmail = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!verificationCode.join('')) {
            setError('Ingrese un código de verificación válido');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${URLConnection}/users/verification-password`, {
                email: data.customer.email,
                resetCode: parseInt(verificationCode.join(''))
            });
            await new Promise(resolve => setTimeout(resolve, 4000));

            if (response.data.success) {
                verification({ status: true, message: 'Correo Verificado con éxito.' });
                setLoading(false);
                RealizarPago();
            } else {
                setLoading(false);
                setError('Error al verificar el código. Intente de nuevo.');
            }
        } catch (error) {
            setLoading(false);
            setError('Error al verificar el código. Intente de nuevo.');
            console.error('Error al verificar el código:', error.response || error.message || error);
            verification(false);
        }
    };

    // En el componente:
    return (
        <>
            <div className="fixed ease-in duration-1000 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    {isRegistering || registerError ? (
                        <>
                            <div className="text-center">
                                {registerError ? (
                                    <p className="mb-4 text-lg font-semibold text-red-600">{registerError}</p>
                                ) : (
                                    <><p className='mb-4 text-lg font-semibold text-green-600'>Registrando Cita...</p>
                                        <div className="flex justify-center items-center">
                                            <i className="fa-solid fa-spinner animate-spin text-2xl text-green-600"></i>
                                        </div>
                                    </>
                                )}
                                {registerError && (
                                    <button
                                        className="mt-4 px-3 py-2 bg-red-500 text-md border rounded text-white shadow-md hover:bg-red-600"
                                        onClick={RealizarPago}
                                    >
                                        Intentar de nuevo
                                    </button>
                                )}
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl text-purple-600 font-semibold">Verificación de Correo Electrónico</h2>
                                <button
                                    onClick={onBack}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="mb-4">Por favor, ingrese el código de verificación enviado a su correo electrónico.</p>

                            <form>
                                <div className="flex justify-between mb-8">
                                    {verificationCode.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            maxLength={1}
                                            className="w-12 h-12 rounded border border-gray-600 shadow text-center text-2xl"
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                        />
                                    ))}
                                </div>
                                {error && <span className='text-red-500'>{error}</span>}
                                {error && (
                                    <Link
                                        className="mt-4 flex text-blue-500 text-md hover:text-blue-600"
                                        onClick={resendVerification}
                                    >
                                        Reenviar....
                                    </Link>
                                )}
                                <div className="flex justify-end space-x-2">
                                    <button type="button" variant="outline" className='px-3 py-2 bg-gray-400 text-md border rounded text-white shadow-md hover:bg-gray-600' onClick={onBack} >
                                        Cancelar
                                    </button>
                                    <button
                                        className={`px-3 py-2 bg-white border text-green-600 border-gray-300 rounded-md text-md font-semibold shadow-sm hover:bg-green-600 hover:text-white ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                        type='button'
                                        onClick={verficateEmail}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fa-solid fa-spinner animate-spin"></i> Verificando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-check-circle mr-2"></i> Verificar código
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
            {showSurvey && (
                    <Encuesta id_user={idUser} onComplete={handleSurveyComplete} />
            )}

        </>
    );

}

export default ConfirmateEmail