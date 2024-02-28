import React, { useEffect, useState } from 'react';
import '../../CSS/productos.css'
import ZoomImage from '../../Componentes/ZoomImage';
import { Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';

function Productos({ searchTerm }) {
  const [filterProducts, setFilterProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null)

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
                <Card className=' loging text-white card-container'>
                  <Card.Img
                    variant='top'
                    as={ZoomImage}
                    src={producto.image}
                    className='card-image'
                    onDoubleClick={() => openModal(producto)}
                  />
                  {/* <Card.Img variant='top' src={producto.image} className='card-image' /> */}
                  <Card.Body>
                    <Card.Title>{producto.name}</Card.Title>
                    <Card.Footer>
                      <small className='text-white'>Precio: ${producto.price}</small>
                      <small className='text-white d-flex'>{producto.description}</small>
                    </Card.Footer>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header cloesButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedProduct?.description}</p>
          <p>Precio : {selectedProduct?.price}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Productos;
