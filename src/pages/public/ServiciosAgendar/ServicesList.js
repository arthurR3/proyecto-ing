import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ApiConnection from '../../../Components/Api/ApiConfig';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../../Components/Servicios/ServicesCard';
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

    return (
        <div className='container mx-auto p-4'>
            <div className='flex items-center mb-4'>
                <i className='fa-solid ml-3 fa-arrow-left' onClick={() => navigate(-1)}>
                    <span onClick={() => navigate(-1)} className=' font-normal text-xl ml-4 text-blue-600 hover:text-blue-800 cursor-pointer'>
                        Regresar
                    </span>
                </i>
            </div>
            <h1 className='text-center text-2xl md:text-3xl font-bold mb-6 text-purple-700'>
                Servicios en {category}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} showDetails={true} onClick={() => navigate(`/servicio/horarios/${service.id}`)} />
                ))}
            </div>
        </div>
    );
};

export default ServicesList;
