import React, { useEffect, useState } from 'react';
import '../../CSS/productos.css'
import { Card } from 'react-bootstrap';
import axios from 'axios';

function Productos({ searchTerm }) {
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
  }, [searchTerm]);

  return (
    <div className='wrapper d-flex align-items-center justify-content-center'>
      <div className="containerProds">
        <div className="products-section">
          <div className="row">
            {filterProducts.length === 0 ? (
              <div className="home-page">
                <div className="container m-1">
                  <h4 className="mb-5 text-black fs-1">El producto no se encuentra</h4>
                </div>
              </div>
            ) : (
              filterProducts.map(producto => (
                <div className="col-md-4 mb-4" key={producto.id}>
                  <Card className=' loging text-white card-container'>
                    <Card.Img variant='top' src={producto.image} className='card-image' />
                    <Card.Body>
                      <Card.Title>{producto.name}</Card.Title>
                      <Card.Footer>
                        <small className='text-white'>Precio: ${producto.price}</small>
                        <small className='text-white d-flex'>{producto.description}</small>
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Productos;
