import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const ProductForm = ({ onSubmit, initialProduct }) => {
  const [product, setProduct] = useState(initialProduct || {
    id_category: '',
    id_brand: '',
    id_supplier: '',
    name: '',
    price: '',
    amount: '',
    description: '',
    image: ''
  });
  const [showForm, setShowForm] = useState(!!initialProduct);

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setShowForm(true);
    } else {
      setProduct({
        id_category: '',
        id_brand: '',
        id_supplier: '',
        name: '',
        price: '',
        amount: '',
        description: '',
        image: ''
      });
      setShowForm(false);
    }
  }, [initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  const handleCancel = () => {
    setProduct({
      id_category: '',
      id_brand: '',
      id_supplier: '',
      name: '',
      price: '',
      amount: '',
      description: '',
      image: ''
    });
    onSubmit(null);
    setShowForm(false);
  };

  if (!showForm) {
    return null;
  }

  return (
    <div>
      <h2>{initialProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="productCategory">
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el ID de la categoría"
            name="id_category"
            value={product.id_category}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="productBrand">
          <Form.Label>Marca</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el ID de la marca"
            name="id_brand"
            value={product.id_brand}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="productSupplier">
          <Form.Label>Proveedor</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el ID del proveedor"
            name="id_supplier"
            value={product.id_supplier}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="productName">
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el nombre del producto"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="productPrice">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese el precio del producto"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="productAmount">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese la cantidad del producto"
            name="amount"
            value={product.amount}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="productDescription">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Ingrese la descripción del producto"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="productImage">
          <Form.Label>URL de la Imagen</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la URL de la imagen del producto"
            name="image"
            value={product.image}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className='mb-4'>
          {initialProduct ? 'Actualizar' : 'Agregar'}
        </Button>
        <Button variant="secondary"  className="ml-2" onClick={handleCancel}>
          Cancelar
        </Button>
      </Form>
    </div>
  );
};

export default ProductForm;
