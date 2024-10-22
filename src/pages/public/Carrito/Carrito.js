import React, { useContext, useEffect, useReducer, useState } from 'react';
import ProductoCarrito from '../../../features/Carrito/ProductoCarrito';
import Resumen from '../../../features/Carrito/Resumen';
import SelectorDireccion from '../../../features/Carrito/SelectorDireccion';
import { CartContext } from '../../../Components/Context/CarritoContext.js';
import axios from 'axios';
import { useAuth } from '../../../Components/Context/AuthContext.js';
import ApiConnection from '../../../Components/Api/ApiConfig.js';
import { jwtDecode } from 'jwt-decode';
const URLConnection = ApiConnection()
const Carrito = () => {
    const { cart, removeCart, addToCart, clearCart } = useContext(CartContext)
    const { token } = useAuth()
    const [userToken, setUserToken] = useState(null)
    const [direcciones, setDirecciones] = useState([])
    const [direccionSeleccionada, setDireccionSeleccionada] = useState(null)
    const [esDomicilio, setEsDomicilio] = useState(false)
    const costoEnvio = esDomicilio ? 35 : 0;
    const handleSeleccion = (id, esDomicilio) => {
        setDireccionSeleccionada(id)
        setEsDomicilio(esDomicilio)
    }
    useEffect(() => {
        if (token) {
            const decode = jwtDecode(token)
            setUserToken(decode.user)
        }
    }, [token])

    useEffect(() => {
        if (userToken && userToken.idUser) {
            const id_user = userToken.idUser
            fetch(`${URLConnection}/address/${id_user}`)
                .then(response => response.json())
                .then(data => setDirecciones(data))
                .catch(err => console.log('Error fetching direcciones', err))
        }
    }, [userToken])

    const handleAumentar = (producto) => {
        addToCart(producto, 1)
    }
    const handleDisminuir = (producto) => {
        const itemProduct = cart.find((item) => item.id === producto.id)
        if (itemProduct && itemProduct.quantity > 0) {
            addToCart(producto, -1)
        } else {
            removeCart(producto.id)
        }
    }

    const handleRealizarCompra = async () => {
        try {
            const UserId = userToken.idUser
            const pedido = {
                UserId,
                productos: cart.map(producto => ({
                    id: producto.id,
                    nombre: producto.name,
                    quantity: producto.quantity,
                    unit_amount: Math.round(producto.price * 100)
                })),
                costoEnvio,
                direccionEnvio: direccionSeleccionada
            }

            const response = await axios.post(`${URLConnection}/sales/createOrder`, pedido)
            const init_point = response.data.url
            window.location.href = init_point
        } catch (error) {
            console.log('Error al confirmar pedido ', error)
        }
    }

    return (
        <div className='container mx-auto'>
            {/* bg-gradient-to-br from-purple-100 to-pink-100 */}
            <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-center mb-10">
                        <i className="fa-solid fa-cart-shopping text-purple-600 inline-block mr-2 h-12 w-12"></i>
                        Carrito de Compras
                    </h1>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        <div className='lg:col-span-2'>
                            <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
                                <div className='p-6'>
                                    <h2 className='text-2xl font-semibold text-gray-600 mb-4'>Productos en el carrito</h2>

                                    {cart.length === 0 && (
                                        <div className='p-6 justify-center'>
                                            <h3 className='text-2xl items-center text-gray-400'>Tu carrito de compras está vacío! Agrega productos para comprar!</h3>
                                        </div>
                                    )}
                                    {cart.map((producto) => (
                                        <ProductoCarrito
                                            key={producto.id}
                                            {...producto}
                                            Aumentar={() => handleAumentar(producto)}
                                            Disminuir={() => handleDisminuir(producto)}
                                            Remover={() => removeCart(producto.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Resumen productos={cart} costoEnvio={costoEnvio} />
                            <SelectorDireccion direccion={direcciones} onSeleccion={handleSeleccion} />
                            <button
                                onClick={() => handleRealizarCompra()}
                                className={`w-full py-3 px-4 rounded-lg text-white text-lg font-semibold transition-color ${!direccionSeleccionada || cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : ' bg-purple-600 hover:bg-purple-700'
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="inline-block mr-2 h-6 w-6"
                                >
                                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                                    <path d="M2 10h20" />
                                    <path d="M7 15h1" />
                                    <path d="M9 15h3" />
                                </svg>

                                Proceder al Pago
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Carrito;