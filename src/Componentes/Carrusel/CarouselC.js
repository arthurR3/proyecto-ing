import React, { useEffect, useState } from 'react';
import { Card, Carousel } from 'react-bootstrap';
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
        <Carousel interval={null} prevIcon={<span className="carousel-control-prev-icon" style={{ backgroundColor: 'red' }} />} nextIcon={<span className="carousel-control-next-icon" style={{ backgroundColor: 'red' }} />}>
            {filterProducts.map((producto, index) => (
                index % 2 === 0 && (
                    <Carousel.Item key={producto.id}>
                        <div className="d-flex justify-content-around">
                            <Card style={{ width: '18rem' }} onClick={() => handleCardClick(producto.id)}>
                                <Card.Img variant="top" src={producto.image} />
                                <Card.Body>
                                    <Card.Title>{producto.name}</Card.Title>
                                    <Card.Text>
                                        Precio: ${producto.price}
                                    </Card.Text>
                                    <Card.Text>
                                        Categoría: {producto.categoria}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            {filterProducts[index + 1] && (
                                <Card style={{ width: '18rem' }} onClick={() => handleCardClick(filterProducts[index + 1].id)}>
                                    <Card.Img variant="top" src={filterProducts[index + 1].image} />
                                    <Card.Body>
                                        <Card.Title>{filterProducts[index + 1].name}</Card.Title>
                                        <Card.Text>
                                            Precio: ${filterProducts[index + 1].price}
                                        </Card.Text>
                                        <Card.Text>
                                            Categoría: {filterProducts[index + 1].categoria}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            )}
                        </div>
                    </Carousel.Item>
                )
            ))}
        </Carousel>
    );
};

export default CarouselC;
