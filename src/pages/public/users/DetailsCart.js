import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ApiConnection from '../../../Components/Api/ApiConfig.js';
import LoadingSpinner from '../../../Components/Loading/Loading.js';
import { useAuth } from '../../../Components/Context/AuthContext.js';
import { jwtDecode } from 'jwt-decode';

const URLConnection = ApiConnection();

const DetailsOrder = () => {
    const { token } = useAuth();
    const { addToCart } = 1;
    const [isLoading, setIsLoading] = useState(false);
    const [filterDate, setFilterDate] = useState('todas');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('todas');
    const [userToken, setUserToken] = useState([])

    useEffect(() =>{
        if(token){
            const decodedToken = jwtDecode(token);
            setUserToken(decodedToken.user)
        }
    },[token])

    useEffect(() => {
        fetchOrders();
    }, [userToken, token]);

    const fetchOrders = async () => {
        setIsLoading(true);
        if (userToken && userToken.idUser) {
            const id_user = userToken.idUser;
        try {
            const response = await axios.get(`${URLConnection}/sales/${id_user}`);
            setOrders(response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date))); // Ordenar en orden descendente
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    }
    };

    useEffect(() => {
        const filterOrders = () => {
            const now = new Date();
            const filterDateObj = (date) => {
                const orderDate = new Date(date);
                if (filterDate === 'semana') {
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    return orderDate >= startOfWeek && orderDate <= endOfWeek;
                } else if (filterDate === 'mes') {
                    return orderDate.getFullYear() === now.getFullYear() && orderDate.getMonth() === now.getMonth();
                } else if (filterDate === 'mesPasado') {
                    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
                    return orderDate.getFullYear() === lastMonth.getFullYear() && orderDate.getMonth() === lastMonth.getMonth();
                }
                else if (filterDate === 'año') {
                    return orderDate.getFullYear() === now.getFullYear();
                }
                return true; // Mostrar todas las órdenes si no se aplica ningún filtro
            };

            const filterStateObj = (state) => {
                if (filtroEstado === 'todas') {
                    return true;
                }
                return state === filtroEstado
            }

            setFilteredOrders(orders.filter(order => filterDateObj(order.date) && filterStateObj(order.shipping_status)));
        };

        filterOrders();
    }, [orders, filterDate, filtroEstado]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className='max-w-4xl mx-auto p-4'>
                <h1 className='text-2xl font-semibold text-purple-800 mb-6'>Mis Compras</h1>
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                        <select className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value='todas'>Todas las compras</option>
                            <option value='Entregado'>Entregadas</option>
                            <option value='En proceso'>En proceso</option>
                        </select>
                        <select className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                            onChange={(e) => setFilterDate(e.target.value)}
                        >
                            <option value='todas'>Todas</option>
                            <option value='semana'>Semana</option>
                            <option value='mes' >Este Mes</option>
                            <option value='año'>Este Año</option>
                        </select>
                        <button className='btn btn-default' title='Reload' onClick={() => fetchOrders()}><i className='fa fa-sync-alt'></i></button>
                    </div>
                </div>
                <hr />
                <div className='space-y-4'>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        filteredOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
                                <div className='flex justify-between items-center mb-2'>
                                    <h3 className='text-lg font-semibold text-blue-600'>Compra #{order.id}</h3>
                                    <span className='text-md text-gray-500'>{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div className='flex flex-wrap gap-4 mb-4'>
                                    {order.details.map((detail, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <img src={detail.image_product} alt={detail.product_name} className='w-20 h-20 object-cover rounded' />
                                            <span className='text-sm text-gray-700 font-semibold'>{detail.product_name}</span>
                                            <span className='text-sm text-gray-700'>Cantidad: {detail.amount}</span>
                                           
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center text-sm mb-2 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Total: ${order.total.toFixed(2)}</span>
                                </div>
                                <div className='flex items-center justify-between mt-2'>
                                    <p className='text-sm capitalize'>
                                        Estado <span className={`font-semibold ${order.shipping_status === 'Entregado'? 'text-green-600' :
                                            order.shipping_status === 'En proceso' ? 'text-orange-600' : 'text-red-600'
                                        }`}>{order.shipping_status}</span>
                                    </p>
                                    <button className='text-md text-blue-600 hover:text-blue-800 focus:outline-none'>Ver detalles</button>
                                </div>
                            </div>
                        ))
                    )}
                    {filteredOrders.length===0 &&(
                        <div className='bg-white rounded-lg shadow-md p-8 text-center'>
                            <p className='text-gray-500'>No se encontraron compras con los filtros seleccionados</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsOrder;
