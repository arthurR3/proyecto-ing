import React, { useEffect, useState } from 'react';
import { Card, Button, Carousel } from 'react-bootstrap';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';

const CarouselC = () => {
    // const history = useHistory();

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const handleCardClick = () => {
        // Redireccionar a otra página al hacer clic en la tarjeta
        // history.push('/otra-pagina');
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} interval={null} prevIcon={<span className="carousel-control-prev-icon" />} nextIcon={<span className="carousel-control-next-icon" />}>
            <Carousel.Item>
                <div className="d-flex justify-content-around">
                    <Card style={{ width: '18rem' }} onClick={handleCardClick}>
                        <Card.Img variant="top" src="imagen1.jpg" />
                        <Card.Body>
                            <Card.Title>Nombre del producto 1</Card.Title>
                            <Card.Text>
                                Precio: $100
                            </Card.Text>
                            <Card.Text>
                                Categoría: Categoría 1
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }} onClick={handleCardClick}>
                        <Card.Img variant="top" src="imagen2.jpg" />
                        <Card.Body>
                            <Card.Title>Nombre del producto 2</Card.Title>
                            <Card.Text>
                                Precio: $150
                            </Card.Text>
                            <Card.Text>
                                Categoría: Categoría 2
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </Carousel.Item>
            <Carousel.Item>
                <div className="d-flex justify-content-around">
                    <Card style={{ width: '18rem' }} onClick={handleCardClick}>
                        <Card.Img variant="top" src="imagen3.jpg" />
                        <Card.Body>
                            <Card.Title>Nombre del producto 3</Card.Title>
                            <Card.Text>
                                Precio: $200
                            </Card.Text>
                            <Card.Text>
                                Categoría: Categoría 3
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }} onClick={handleCardClick}>
                        <Card.Img variant="top" src="imagen4.jpg" />
                        <Card.Body>
                            <Card.Title>Nombre del producto 4</Card.Title>
                            <Card.Text>
                                Precio: $250
                            </Card.Text>
                            <Card.Text>
                                Categoría: Categoría 4
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </Carousel.Item>
        </Carousel>
    );
};

export default CarouselC;
