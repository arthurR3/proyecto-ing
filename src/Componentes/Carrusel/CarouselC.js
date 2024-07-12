import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';
import ApiConnection from '../Api/ApiConfig';
import { useNavigate } from 'react-router-dom';

const URLConnection = ApiConnection();

const CarouselC = () => {
    // const history = useHistory();

    const [filterProducts, setFilterProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${URLConnection}/products`);
                setFilterProducts(response.data);
            } catch (error) {
                console.log('Error fetching products: ', error);
            }
        };
        fetchData();
    }, []);

    const handleCardClick = (id) => {
        // Redireccionar a la página del producto al hacer clic en la tarjeta
        // history.push(`/producto/${id}`);
    };

    return (
        <Carousel interval={3000} prevIcon={<span className="carousel-control-prev-icon bc-red" style={{ backgroundColor: 'red' }} />} nextIcon={<span className="carousel-control-next-icon" style={{ backgroundColor: 'red' }} />} >
            {filterProducts.map((producto, index) => (
                index % 3 === 0 && (
                    <Carousel.Item key={producto.id}>
                        <div className="d-flex justify-content-around">
                            <div className="card" style={{ width: '18rem' }} onClick={() => handleCardClick(producto.id)}>
                                <img className="card-img-top" src={producto.image} alt="Card image cap" />
                                <div className="card-body">
                                    <h5 className="card-title">{producto.name}</h5>
                                    <p className="card-text">Precio: ${producto.price}</p>
                                    <p className="card-text">Categoría: {producto.categoria}</p>
                                </div>
                            </div>
                            {filterProducts[index + 1] && (
                                <div className="card" key={filterProducts[index + 1].id} style={{ width: '18rem' }} onClick={() => handleCardClick(filterProducts[index + 1].id)}>
                                    <img className="card-img-top" src={filterProducts[index + 1].image} alt="Card image cap" />
                                    <div className="card-body">
                                        <h5 className="card-title">{filterProducts[index + 1].name}</h5>
                                        <p className="card-text">Precio: ${filterProducts[index + 1].price}</p>
                                        <p className="card-text">Categoría: {filterProducts[index + 1].categoria}</p>
                                    </div>
                                </div>
                            )}
                            {filterProducts[index + 2] && (
                                <div className="card" key={filterProducts[index + 2].id} style={{ width: '18rem' }} onClick={() => handleCardClick(filterProducts[index + 2].id)}>
                                    <img className="card-img-top" src={filterProducts[index + 2].image} alt="Card image cap" />
                                    <div className="card-body">
                                        <h5 className="card-title">{filterProducts[index + 2].name}</h5>
                                        <p className="card-text">Precio: ${filterProducts[index + 2].price}</p>
                                        <p className="card-text">Categoría: {filterProducts[index + 2].categoria}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Carousel.Item>
                )
            ))}
        </Carousel>
    );
};

const CarouselService = () => {
    const [services, setServices] = useState([]);
    const navigation = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${URLConnection}/services`);
                setServices(response.data);
            } catch (error) {
                console.log('Error fetching services: ', error);
            }
        };
        fetchData();
    }, []);

    const getCategories = (services) => {
        const uniqueCategory = {};
        services.forEach(service => {
            if (!uniqueCategory[service.Categoria.name]) {
                uniqueCategory[service.Categoria.name] = {
                    name: service.Categoria.name,
                    image: service.image
                };
            }
        });
        return Object.values(uniqueCategory);
    };

    const uniqueCategories = getCategories(services);

    const groupCategories = categories => {
        let grouped = []
        for (let i = 0; i < categories.length; i += 3) {
            grouped.push(categories.slice(i, i + 3));
        }
        return grouped;
    }
    const groupedCategorie = groupCategories(uniqueCategories);

    const handleCardClick = category => {
        navigation(`/servicios/categories/${category}`)
    };

    return (
        <Carousel interval={3000} prevIcon={<span className="carousel-control-prev-icon bc-blue " style={{ backgroundColor: 'blue' }} />} nextIcon={<span className="carousel-control-next-icon" style={{ backgroundColor: 'blue' }} />} >
            {groupedCategorie.map((group, groupIndex) => (
                <Carousel.Item key={groupIndex}>
                    <div className="d-flex justify-content-around mt-5 mb-5">
                        {group.map((category, index) => (
                            <div key={`${category.name}-${index}`} onClick={()=> handleCardClick(category.name)}>
                                <img className='d-block rounded-circle' src={category.image} alt={`Slide ${index}`}
                                    style={{ width: '250px', height: '250px', objectFit: 'cover', margin: '0 auto' }} />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold mt-3">{category.name}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export { CarouselC, CarouselService };
