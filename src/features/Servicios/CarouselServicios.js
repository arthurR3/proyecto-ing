import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../css/Carrusel.css';
import axios from 'axios';
import LoadingSpinner from '../../Components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
function ServiceCarousel() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        const loadServices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/services/');
                setServices(getUniqueCategories(response.data));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    const getUniqueCategories = (services) => {
        const uniqueCategories = {};
        services.forEach(service => {
            if (!uniqueCategories[service.Categoria.name]) {
                uniqueCategories[service.Categoria.name] = {
                    name: service.Categoria.name,
                    image: service.image // Ajustar según tu estructura de datos
                };
            }
        });
        return Object.values(uniqueCategories);
    };

    const settings = {
        accessibility: true,
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="w-3/4 justify-center rounded-xl m-auto">
            <div className="mt-2">
                <Slider {...settings}>
                    {services.map((category, index) => (
                        <div key={`${category.name}-${index}`} className="text-center" onClick={ () => navigate(`/servicio/${category.name}`)}>
                            <img
                                src={category.image}
                                alt={category.name}
                                className="rounded-full w-48 h-48 object-cover mx-auto"
                            />
                            <h3 className="mt-4 text-lg text-purple-700 font-extrabold">{category.name}</h3>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default ServiceCarousel;
