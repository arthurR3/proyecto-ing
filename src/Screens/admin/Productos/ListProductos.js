import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import ProductForm from './ActionsProducts.js';
import ApiConnection from '../../../Componentes/Api/ApiConfig.js';
const URLConnetion = ApiConnection();

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${URLConnetion}/products`); // Ajusta la URL según tu API
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleUpdateOrEdit = (product) => {
    // Lógica para agregar o actualizar el producto
    if (product) {
      if (product.id) {
        // Lógica de actualización
        console.log('Actualizar producto:', product);
      } else {
        // Lógica de agregado
        console.log('Agregar producto:', product);
      }
      setSelectedProduct(null);
      setShowForm(false);
    } else {
      setSelectedProduct(null);
      setShowForm(false);
    }
  };

  const handleAdd = () => {
    setSelectedProduct({});
    setShowForm(true);
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    // Lógica para eliminar el producto
    console.log(`Eliminar producto con id: ${id}`);
  };

  return (
    <div className="container py-5 mt-5">
      <h3>Listado de Productos</h3>
      <Row>
        <Col md={12}>
        <Button variant="success" onClick={handleAdd} className="mb-3">
            Agregar Producto
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th></th>
                <th>Marca</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td><img src={product.image} alt={product.name} width="50" /></td>
                  <td>{product.Marca.name}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.amount}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleUpdate(product)} className="mr-2">
                      Actualizar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(product.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col md={8} className='mt-5'>
          
          {showForm && (
            <ProductForm onSubmit={handleUpdateOrEdit} initialProduct={selectedProduct} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductList;