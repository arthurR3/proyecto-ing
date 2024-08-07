import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiConnection from '../../Componentes/Api/ApiConfig.js';
import LoadingSpinner from '../../Componentes/Loading/Loading.js';
import { toast } from 'react-toastify';

const URLConnection = ApiConnection();

const ConfirmationDates = () => {
    const navigation = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const searchParams = new URLSearchParams(location.search);
    const appointmentId = searchParams.get('appointmentId');
    const userID = searchParams.get('userID');

    useEffect(() => {
        if (appointmentId) {
            axios.post(`${URLConnection}/dates/confirmation`, { appointmentId, userID })
                .then(response => {
                    toast.success("Se realizó la confirmación de su cita correctamente");
                    setSuccess(true);
                    setTimeout(() => {
                        setLoading(false);
                        navigation('/');
                    }, 3000); // Esperar 3 segundos antes de redirigir
                })
                .catch(error => {
                    console.error('Error fetching session data:', error);
                    toast.error("Hubo un error al confirmar la cita");
                    setLoading(false);
                    setError(true);


                });
        }
    }, [appointmentId, userID, navigation]);

    /* if (loading) {
        return <LoadingSpinner />;
    } */

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            {success ? (
                                <div className="alert alert-success text-center" role="alert">
                                    <h1 className="alert-heading">Confirmación realizada con éxito!</h1>
                                    <p className='mb-0'>Gracias por confirmar tu cita. Te esperamos! Estetica Principal Emma.</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger text-center" role="alert">
                                    <h1 className="alert-heading">¡La confirmacion no se realizó con éxito!</h1>
                                    <p className='mb-0'>Por favor, vuelva a intentarlo.</p>
                                </div>
                            ) : (
                                <div className="alert alert-info text-center" role="alert">
                                    <h1 className="alert-heading">Procesando...</h1>
                                    <p className='mb-0'>Estamos procesando  por favor espere.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ConfirmationDates;


