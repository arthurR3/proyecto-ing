import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import { toast } from 'react-toastify';
const URLConnection = ApiConnection();

const PromotionForm = ({ promotion = {}, onSubmit }) => {
  const [promotionData, setPromotionData] = useState({
    id: promotion.id || '',
    title: promotion.title || '',
    description: promotion.description || '',
    discountPercentage: promotion.discountPercentage || '',
    startDate: promotion.startDate || '',
    endDate: promotion.endDate || '',
    isForProduct: promotion.isForProduct || false,
    productId: promotion.productId || '',
    isForService: promotion.isForService || false,
    serviceId: promotion.serviceId || '',
  });

  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchProductsAndServices = async () => {
      try {
        const [productsResponse, servicesResponse] = await Promise.all([
          axios.get(`${URLConnection}/products`), // Cambia la URL según tu API
          axios.get(`${URLConnection}/services`), // Cambia la URL según tu API
        ]);
        setProducts(productsResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Error fetching products or services', error);
      }
    };

    fetchProductsAndServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPromotionData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${URLConnection}/promotion/`, promotionData);
      toast.success('Promoción guardada correctamente');
    } catch (err) {
      toast.error('Error al guardar la promoción');
    }
  };
  

  return (
    <div className="container py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4">{promotion.id ? 'Editar Promoción' : 'Agregar nueva promoción'}</h2>
              <form onSubmit={handleSubmit} className='title'>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Titulo</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    value={promotionData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripcion</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={promotionData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="discountPercentage" className="form-label">Porcentaje de descuento</label>
                  <input
                    type="number"
                    id="discountPercentage"
                    name="discountPercentage"
                    className="form-control"
                    value={promotionData.discountPercentage}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="startDate" className="form-label">Fecha de Incio</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="form-control"
                    value={promotionData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label">Fecha Final</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="form-control"
                    value={promotionData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    id="isForProduct"
                    name="isForProduct"
                    className="form-check-input"
                    checked={promotionData.isForProduct}
                    onChange={handleChange}
                  />
                  <label htmlFor="isForProduct" className="form-check-label">Aplica para Productos</label>
                </div>
                {promotionData.isForProduct && (
                  <div className="mb-3">
                    <label htmlFor="productId" className="form-label">Productos</label>
                    <select
                      id="productId"
                      name="productId"
                      className="form-select"
                      value={promotionData.productId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un producto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    id="isForService"
                    name="isForService"
                    className="form-check-input"
                    checked={promotionData.isForService}
                    onChange={handleChange}
                  />
                  <label htmlFor="isForService" className="form-check-label">Aplica para servicios</label>
                </div>
                {promotionData.isForService && (
                  <div className="mb-3">
                    <label htmlFor="serviceId" className="form-label">Servicios</label>
                    <select
                      id="serviceId"
                      name="serviceId"
                      className="form-select"
                      value={promotionData.serviceId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un servicio</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button type="submit" className="btn btn-primary">{promotion.id ? 'Actualizar Promocion' : 'Añadir Promocion'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm;
