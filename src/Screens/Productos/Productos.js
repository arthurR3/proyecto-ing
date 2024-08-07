import React, { useState, useEffect } from 'react';
import '../../CSS/productos.css';
import ZoomImage from '../../Componentes/ZoomImage';
import { Card, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { useCart } from '../../Componentes/useCart';
import CustomModal from '../../Componentes/Modal';
import { useAuth } from '../../Componentes/Context/AuthContext';
import { toast } from 'react-toastify';
import ApiConnection from '../../Componentes/Api/ApiConfig';
const URLConnetion = ApiConnection();

function Productos() {
    const { addToCart } = useCart();
    const [filterProducts, setFilterProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');

    const { isAuthenticated } = useAuth();

    const calculateDiscountedPrice = (price, discount) => {
        return (price - (price * discount / 100)).toFixed(2);
    };

    const handleAddToCart = async (product) => {
        if (isAuthenticated) {
            try {
                // Calculate discounted price if applicable
                const price = product.promotion ? calculateDiscountedPrice(product.price, product.promotion.discount) : product.price;
                const productWithUpdatedPrice = { ...product, price: parseFloat(price) };

                addToCart(productWithUpdatedPrice);
                toast.success('Producto agregado al carrito.')
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
            }
        } else {
            // Aquí puedes mostrar un mensaje al usuario indicando que debe iniciar sesión
            toast.warn('Debes iniciar sesión para agregar productos al carrito');
        }
    };

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
                const [productResponse, promoResponse] = await Promise.all([
                    axios.get(`${URLConnetion}/products`),
                    axios.get(`${URLConnetion}/promotion`)
                ]);

                const allProducts = productResponse.data.filter(product => product.status === true);
                const activePromotions = promoResponse.data.filter(promo => promo.status === true);

                let productsWithPromotions = allProducts.map(product => {
                    const productPromotion = activePromotions.find(promo => promo.id_product === product.id);
                    return {
                        ...product,
                        promotion: productPromotion || null
                    };
                });

                // Filter products based on search and filters
                if (searchTerm) {
                    productsWithPromotions = productsWithPromotions.filter(product =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                if (categoryFilter) {
                    productsWithPromotions = productsWithPromotions.filter(product =>
                        product.Categoria.name === categoryFilter
                    );
                }

                if (brandFilter) {
                    productsWithPromotions = productsWithPromotions.filter(product =>
                        product.Marca.name === brandFilter
                    );
                }

                setFilterProducts(productsWithPromotions);
            } catch (error) {
                toast.warn('Error al obtener los productos, Intente de Nuevo!')
            }
        };
        fetchData();
    }, [searchTerm, categoryFilter, brandFilter]);

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-log-12 mx-auto'>
                    <div className='text-black p-5 shadow-sm rounded'>
                        <div className='col-12 text-center'>
                            <h1 className='title'>Explora tu Camino hacia la Belleza</h1>
                            <div className='d-flex justify-content-center'>
                                <FormControl
                                    type='text'
                                    placeholder='Buscar...'
                                    className='mr-sm-4 search-input w-50'
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className='d-flex justify-content-center pt-2'>
                                <select className='form-select w-25' onChange={(e) => setCategoryFilter(e.target.value)}>
                                    <option value=''>Seleccionar categoría</option>
                                    <option value='Maquillaje'>Maquillaje</option>
                                    <option value='Cuidado de la piel'>Cuidado de la piel</option>
                                    <option value='Cuidado del Cabello'>Cuidado del Cabello</option>
                                    <option value='Perfumes  Fragancias'>Perfumes  Fragancias</option>
                                    <option value='Cuidado de uñas'>Cuidado de uñas</option>
                                </select>
                                <select className='form-select w-25' onChange={(e) => setBrandFilter(e.target.value)}>
                                    <option value=''>Seleccionar marca</option>
                                    <option value={`L'Oreal`}>L'Oreal</option>
                                    <option value='Garnier'>Garnier</option>
                                    <option value='PMaybelline'>PMaybelline</option>
                                    <option value='Urban Decay'>Urban Decay</option>
                                    <option value='NARS'>NARS</option>
                                    <option value='Pantene'>Pantene</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {filterProducts.length === 0 ? (
                <div className="home-page">
                    <div className="container m-1">
                        <h4 className="mb-5 text-black fs-1">El producto no se encuentra</h4>
                    </div>
                </div>
            ) : (
                <div className="row py-5">
                    {filterProducts.map(producto => (
                        <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={producto.id}>
                            <div className='bg-white rounded shadow-sm card'>
                                <img className='img-fluid card-img-top'
                                    as={ZoomImage}
                                    src={producto.image}
                                    onDoubleClick={() => openModal(producto)}
                                />
                                <div className='card-body'>
                                    <h5 className='text-dark card-title'>{producto.name}</h5>
                                    <p className='card-text'>
                                        Precio: $ 
                                        {producto.promotion 
                                            ? calculateDiscountedPrice(producto.price, producto.promotion.discount) 
                                            : producto.price.toFixed(2)}
                                    </p>
                                    <p className='card-text'>Cantidad disponible: {producto.amount}</p>
                                    {producto.promotion ? (
                                        <p className='text-success'>¡En promoción! Descuento: {producto.promotion.discount}%</p>
                                    ) : (   
                                        <p className='text-muted'></p>
                                    )}
                                    {producto.amount === 0 ? (
                                        <p className="text-danger">Stock sin disposición</p>
                                    ) : (
                                        <button className='btnCart btn-primary p-2 align-self-center' onClick={() => handleAddToCart(producto)} disabled={producto.stock === 0}>Agregar al carrito</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <CustomModal
                show={showModal}
                onHide={closeModal}
                title={selectedProduct?.name}
            >
                <p>{selectedProduct?.description}</p>
                <p>Precio : $ {selectedProduct?.price.toFixed(2)}</p>
            </CustomModal>
        </div>
    );
}

export default Productos;
