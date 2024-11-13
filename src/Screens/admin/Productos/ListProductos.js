import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApiConnection from '../../../Components/Api/ApiConfig.js';
import LoadingSpinner from '../../../Components/Loading/Loading.js';
import axios from 'axios';
import ProductForm from './FormProductos.js';
import exportToExcel from '../../../Components/Export_reportes/Export_excel.js'
const URLConnetion = ApiConnection();


const ProductList = () => {
  const fileName = 'Productos';
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URLConnetion}/products`);
      setProducts(response.data);
    } catch (error) {
      console.log('Error getting products');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(`${URLConnetion}/products/${id}/`, { status });
      setProducts(products.map(product => product.id === id ? { ...product, status } : product));
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5 mt-5">
      {isEditing ? (
        <ProductForm
          product={selectedProduct}
          onSave={() => {
            setSelectedProduct(null);
            setIsEditing(false);
            fetchProducts();
          }}
          onCancel={() => {
            setSelectedProduct(null);
            setIsEditing(false);
          }}
        />
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className='col-md-offset-1 col-md-12'>
            <div className='panel'>
              <div className='panel-heading'>
                <div className='row d-flex'>
                  <div className='col'>
                    <h4 className='title'>Lista de Productos</h4>
                  </div>
                  <div className='col text-right d-flex mb-3 justify-content-between'>
                    <div className='btn-group'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Buscar'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className='btn btn-default' title='Reload' onClick={() => fetchProducts()}>
                        <i className='fa fa-sync-alt'></i>
                      </button>
                      <button
                        className='btn btn-default'
                        title='Descargar Excel'
                        onClick={() => exportToExcel(filteredProducts, fileName)}
                      >
                        <i className='fa fa-file-excel'></i>
                      </button>
                      <button
                        className="btn btn-default"
                        title='Agregar producto'
                        onClick={() => {
                          setSelectedProduct(null);
                          setIsEditing(true);
                        }}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='panle-body  shadow table-responsive'>
            <table className="table">
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
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td><img src={product.image} alt={product.name} width="50" /></td>
                    <td>{product.Marca.name}</td>
                    <td>{product.name}</td>
                    <td>$ {product.price.toFixed(2)}</td>
                    <td>{product.amount}</td>
                    <td>
                      <div className="d-flex align-items-center m-2">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditing(true);
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square me-1"></i>
                          Editar
                        </button>
                        {product.status ? (
                          <button
                            className="btn btn-sm btn-secondary"
                            title="Desactivar producto"
                            onClick={() => handleStatus(product.id, false)}
                          >
                            <i className="fa fa-eye-slash me-1"></i>
                            Desactivar
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-success"
                            title="Activar producto"
                            onClick={() => handleStatus(product.id, true)}
                          >
                            <i className="fa fa-eye me-1"></i>
                            Activar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
