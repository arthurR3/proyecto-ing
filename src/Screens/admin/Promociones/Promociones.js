import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConnection from '../../../Components/Api/ApiConfig';
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
          axios.get(`${URLConnection}/products`),
          axios.get(`${URLConnection}/services`),
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
    <div className="container mx-auto py-5 mt-4 px-4">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">
              {promotion.id ? 'Editar Promoción' : 'Agregar nueva promoción'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Titulo</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="border border-gray-300 rounded-lg w-full p-2 text-gray-700"
                  value={promotionData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Descripcion</label>
                <textarea
                  id="description"
                  name="description"
                  className="border border-gray-300 rounded-lg w-full p-2 text-gray-700"
                  value={promotionData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="discountPercentage" className="block text-gray-700 font-medium mb-2">Porcentaje de descuento</label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  className="border border-gray-300 rounded-lg w-full p-2 text-gray-700"
                  value={promotionData.discountPercentage}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">Fecha de Incio</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="border border-gray-300 rounded-lg w-full p-2 text-gray-700"
                  value={promotionData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">Fecha Final</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="border border-gray-300 rounded-lg w-full p-2 text-gray-700"
                  value={promotionData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isForProduct"
                  name="isForProduct"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={promotionData.isForProduct}
                  onChange={handleChange}
                />
                <label htmlFor="isForProduct" className="ml-2 text-gray-700">Aplica para Productos</label>
              </div>
              {promotionData.isForProduct && (
                <div className="mb-4">
                  <label htmlFor="productId" className="block text-gray-700 font-medium mb-2">Productos</label>
                  <select
                    id="productId"
                    name="productId"
                    className="border border-gray-300 rounded-lg w-full p-2 text-gray-700"
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
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isForService"
                  name="isForService"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={promotionData.isForService}
                  onChange={handleChange}
                />
                <label htmlFor="isForService" className="ml-2 text-gray-700">Aplica para servicios</label>
              </div>
              {promotionData.isForService && (
                <div className="mb-4">
                  <label htmlFor="serviceId" className="block text-gray-700 font-medium mb-2">Servicios</label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    className="border border-gray-300 rounded-lg w-full p-2 text-gray-700"
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
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full mt-4"
              >
                {promotion.id ? 'Actualizar Promocion' : 'Añadir Promocion'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm;
