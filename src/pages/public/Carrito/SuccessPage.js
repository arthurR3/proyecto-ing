import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiConnection from '../../../Components/Api/ApiConfig';
import LoadingSpinner from '../../../Components/Loading/Loading.js'
import { Toast } from 'primereact/toast';
const URLConnection = ApiConnection();
const SuccessPage = () => {
    const navigation = useNavigate()
    const location = useLocation();
    const [loading, setLoading] = useState(true)
    const [estado, setEstado] = useState('')
    const [cuentaRegressiva, setCuentaRegressiva] = useState(5)
    const hasRequestSent = useRef(false);
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const userID = searchParams.get('userID');

    const processSession = async () => {
        if(sessionId && !hasRequestSent.current){
            hasRequestSent.current = true
            try {
                await  axios.post(`${URLConnection}/sales/success`, { sessionId, userID })
                .then(response => {
                    if (response.status === 200) {
                        setEstado('success');
                        localStorage.removeItem('Cart');
                        setLoading(false);
                        const interval = setInterval(() => {
                            setCuentaRegressiva(prev => {
                                if (prev <= 1) {
                                    clearInterval(interval);
                                    navigation('/carrito-compras');
                                }
                                return prev - 1;
                            });
                        }, 1000);
                    }
                })
                .catch(error => {
                    console.log(error)
                    setEstado('error')
                    setLoading(false);
                });
            } catch (error) {
                console.error('Error al procesar la compra:', error);
                setEstado('error')
                setLoading(false);
            }
        }
    }

    useEffect(() => {
       processSession();
    }, [sessionId, userID, navigation]);

    if (loading) {
        return <LoadingSpinner />
    }
    return (
        <div className='flex items-center justify-center p-4'>
            <div className='bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md'>
                <div className='p-6'>
                    <h2 className='text-4xl font-bold text-center mb-6'>
                        {loading && 'Procesando su pago'}
                        {estado === 'success' && '¡Pago exitoso!'}
                        {estado === 'error' && 'Error en el pago'}
                    </h2>
                    <div className='text-center'>
                        {estado === 'success' && (
                            <div className='flex flex-col items-center space-y-4'>
                                <i className="fa-solid fa-circle-check text-green-600 text-7xl"></i>
                                <p className='text-gray-600'>¡Su compra se realizó correctamente!</p>
                                <p className='text-gray-600'>Gracias por su compra. Su pedido ha sido registrado. Revise su bandeja de correo electronico.</p>
                                <p className='text-gray-600'>Redireccionando en {cuentaRegressiva} segundos...</p>
                            </div>
                        )}
                        {estado == 'error' && (
                            <div className='flex flex-col items-center space-y-4'>
                                <i className="fa-solid fa-circle-xmark text-red-600 text-7xl"></i>
                                <p className='text-gray-600'>Ocurrió un error inesperado</p>
                                <p className="text-gray-600">Por favor, intente nuevamente o intente mas tarde!.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-center">
                        {estado === "success" && (
                            <Link to="/user-info/citas-agendadas">
                                <a className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                    Ir a Mis Compras
                                </a>
                            </Link>
                        )}
                        {estado === "error" && (
                            <Link to="/carrito-compras">
                                <a className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                    Ir a Mi Carrito de compras
                                </a>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
