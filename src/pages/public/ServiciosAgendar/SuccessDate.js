import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiConnection from '../../../Components/Api/ApiConfig.js';
import LoadingSpinner from '../../../Components/Loading/Loading.js';
const URLConnection = ApiConnection();

const SuccessDate = () => {
    const navigation = useNavigate();
    const location = useLocation();
    const hasRequestSent = useRef(false);
    const [loading, setLoading] = useState(true);
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const userID = searchParams.get('userID');

    const processSession = async () => {
        if (sessionId && !hasRequestSent.current) {
            hasRequestSent.current = true; // Marca que la solicitud ya fue enviada
            try {
                const response = await axios.post(`${URLConnection}/dates/success`, { sessionId, userID });
                if (response.data.success) {
                    alert("Se realizó correctamente la cita");
                    setTimeout(() => {
                        setLoading(false);
                        navigation(-3); // Navegar 3 páginas atrás
                    }, 1000);
                } else {
                    alert("Hubo un error al procesar la cita");
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error al procesar la cita:', error);
                alert("Hubo un error al procesar la cita");
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        processSession(); // Llamada a la función async
    }, [sessionId, userID, navigation]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return null;
};

export default SuccessDate;
