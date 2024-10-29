import React, { useEffect, useState } from 'react';
import Catalogo from '../../features/Productos/Catalogo.js';
import LoadingSpinner from '../../Components/Loading/Loading.js';
import axios from 'axios';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/products/');
                setProducts(response.data.filter(product => product.status === true));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    // Filtrar productos aquí antes de pasar a Catalogo
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!categoryFilter || product.Categoria.name === categoryFilter) &&
        (!brandFilter || product.Marca.name === brandFilter)
    );

    // Obtener categorías y marcas únicas
    const categories = [...new Set(products.map(product => product.Categoria.name))];
    const brands = [...new Set(products.map(product => product.Marca.name))];

    return (
        <div>
            <div className="container mx-auto">
                <div className="text-black p-5 shadow-sm rounded bg-white">
                    <div className="w-full text-center">
                        <h1 className="text-4xl text-pretty text-purple-600 font-bold font-sans mb-4">Explora tu Camino hacia la Belleza</h1>
                        <div className="flex justify-center mb-4">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center space-x-4">
                            <select
                                aria-label="Seleccionar categoría" 
                                className="form-select w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                            <select
                                aria-label="Seleccionar marca" 
                                className="form-select w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setBrandFilter(e.target.value)}
                            >
                                <option value="">Seleccionar marca</option>
                                {brands.map((brand, index) => (
                                    <option key={index} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <Catalogo
                products={filteredProducts}
            />
        </div>
    );
}

export default Products;
