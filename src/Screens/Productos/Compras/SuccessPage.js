import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import LoadingSpinner from '../../../Componentes/Loading/Loading.js'
import { toast } from 'react-toastify';
const URLConnection = ApiConnection(); 
const SuccessPage = () => {
    const navigation = useNavigate()
    const location = useLocation();
    const [loading, setLoading] = useState(true)
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const userID = searchParams.get('userID');

    useEffect(() => {
        if (sessionId) {
            axios.post(`${URLConnection}/sales/success`, { sessionId, userID })
                .then(response => {
                    toast.success("Se realizó correctamente la compra");
                    setTimeout(() => {
                        setLoading(false);
                        localStorage.removeItem('Cart')
                        navigation('/shop-cart/details');
                    }, 3000); // Esperar 3 segundos antes de redirigir
                })
                .catch(error => {
                    console.error('Error fetching session data:', error);
                    toast.error("Hubo un error al procesar la compra");
                    setLoading(false);
                });
        }
    }, [sessionId, userID, navigation]);

    if(loading){
        return <LoadingSpinner />  
    }
    return (
        <div className="container py-5 mt-5">
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="card shadow-lg border-0 rounded-lg">
                    <div className="card-body p-5">
                        <div className="alert alert-success text-center" role="alert">
                            <h1 className="alert-heading">Su compra no se realizo con éxito!</h1>
                            <p className='mb-0'> Por favor, regrese al "Carrito" y vuelva a intentarlo</p>
                        </div>
                    </div>
                    <div className="card-footer text-center py-3">
                        <a href="/mis-compras" className="btn btn-primary">
                            Ver Mis Compras
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default SuccessPage;
