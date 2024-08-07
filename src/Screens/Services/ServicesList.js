import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../CSS/citas.css';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { useNavigate } from 'react-router-dom';
const ServicesList = () => {
    const navigate = useNavigate();
    const URLConnection = ApiConnection();
    const { category } = useParams();
    const [services, setServices] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${URLConnection}/services`);
                setServices(response.data.filter(service => service.Categoria.name === category && service.status === true));
            } catch (error) {
                throw new Error('Error getting services')
            }
        };
        fetchData();
    }, [category]);

    const formatDuration = duration => {
        const [hours, minutes] = duration.split(':');
        const h = parseInt(hours, 10);
        const m = parseInt(minutes, 10);
        let formated = '';
        if (h > 0) {
            formated += `${h}h`;
        }
        if (m > 0) {
            formated += ` ${m}min`;
        }
        return formated.trim();
    }

    return (
        <div className='py-5 container'>
            <div className='col-12 text-left mt-2'>
                <i className='fa-solid fa-arrow-left'>
                    <span onClick={() => navigate(-1)} className='btn btn-link text-decoration-none text-reset back-link hover'>
                        Regresar
                    </span>
                </i>
            </div>
            <h1 className='text-center mb-4 fw-bold title'>Servicios en {category}</h1>
            <div className="row">
                {services.map(service => (
                    <div className="col-md-4 mb-4" key={service.id} onClick={()=> navigate(`/servicios/agendar-cita/${service.id}`)}>
                        <div className="card">
                            <img src={service.image} className="card-img-top rounded-circle" alt={service.name} style={{ width: '200px', height: '200px', objectFit: 'cover', margin: '0 auto' }} />
                            <div className="card-body">
                                <h5 className="title">{service.name}</h5>
                                <p className="card-text">{service.description}</p>
                                <p className="card-text">Precio: ${service.price.toFixed(2)}</p>
                                <p className="card-text">Duración: {formatDuration(service.duration)}</p>
                                <button className="btn btn-success">Reservar Ya!</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesList;
