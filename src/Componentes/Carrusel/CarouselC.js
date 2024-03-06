import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';

const CarouselC = () => {
    // const history = useHistory();

    const [filterProducts, setFilterProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://back-estetica.up.railway.app/api/v1/products');
                setFilterProducts(response.data);
            } catch (error) {
                console.log('Error fetching products: ', error);
            }
        }
        fetchData();
    }, []);

    const handleCardClick = (id) => {
        // Redireccionar a la página del producto al hacer clic en la tarjeta
        // history.push(`/producto/${id}`);
    };

    return (
        <Carousel interval={null} prevIcon={<span className="carousel-control-prev-icon bc-red" style={{ backgroundColor: 'red' }} />} nextIcon={<span className="carousel-control-next-icon" style={{ backgroundColor: 'red' }} />} >
            {filterProducts.map((producto, index) => (
                index % 2 === 0 && (
                    <Carousel.Item key={producto.id} >
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
                                <div className="card" style={{ width: '18rem' }} onClick={() => handleCardClick(filterProducts[index + 1].id)}>
                                    <img className="card-img-top" src={filterProducts[index + 1].image} alt="Card image cap" />
                                    <div className="card-body">
                                        <h5 className="card-title">{filterProducts[index + 1].name}</h5>
                                        <p className="card-text">Precio: ${filterProducts[index + 1].price}</p>
                                        <p className="card-text">Categoría: {filterProducts[index + 1].categoria}</p>
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

export default CarouselC;
