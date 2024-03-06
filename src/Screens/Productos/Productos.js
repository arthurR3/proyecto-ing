import React, { useState, useEffect } from 'react';
import '../../CSS/productos.css';
import ZoomImage from '../../Componentes/ZoomImage';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import ProductModal from '../../Componentes/ProductosModal';

function Productos({ searchTerm }) {
    const [filterProducts, setFilterProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [selectedProductId, setSelectedProductId] = useState(null);

    const openModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleMouseEnter = (productId) => {
        setSelectedProductId(productId);
    };

    const handleMouseLeave = () => {
        setSelectedProductId(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://back-estetica.up.railway.app/api/v1/products');
                setFilterProducts(response.data);
            } catch (error) {
                console.log('Error fetching products: ', error);
            }
        };
        fetchData();
    }, [searchTerm]);

    return (
        <div className='productos-container'>
            <div className='productos-wrapper'>
                {filterProducts.length === 0 ? (
                    <div className="home-page">
                        <div className="container m-1">
                            <h4 className="mb-5 text-black fs-1">El producto no se encuentra</h4>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {filterProducts.map(producto => (
                            <div className="col-md-4 mb-4" key={producto.id}>
                                
                                <div
                                    className="card-container"
                                    onMouseEnter={() => handleMouseEnter(producto.id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                   
                                    <Card>
                                        <Card.Img
                                            variant="top"
                                            as={ZoomImage}
                                            src={producto.image}
                                            className="card-image"
                                            onDoubleClick={() => openModal(producto)}
                                        />
                                        <Card.Body>
                                            <Card.Title>{producto.name}</Card.Title>
                                            {selectedProductId === producto.id && (
                                                <Card.Footer>
                                                    <h4>Precio: ${producto.price}</h4>
                                                    <small>{producto.description}</small>
                                                </Card.Footer>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ProductModal
                showModal={showModal}
                closeModal={closeModal}
                selectedProduct={selectedProduct}
            />
        </div>
    );
}

export default Productos;
