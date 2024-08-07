import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import LoadingSpinner from '../../../Componentes/Loading/Loading.js';
import { useAuth } from '../../../Componentes/Context/AuthContext';
import { useCart } from '../../../Componentes/useCart';
import { jwtDecode } from 'jwt-decode';

const URLConnection = ApiConnection();

const DetailsOrder = () => {
    const { token } = useAuth();
    const { addToCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [filterDate, setFilterDate] = useState('todas');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    const data = jwtDecode(token);
    const idUser = data.user.idUser;

    useEffect(() => {
        fetchOrders();
    }, [idUser]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${URLConnection}/sales/${idUser}`);
            setOrders(response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date))); // Ordenar en orden descendente
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
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
                }else if (filterDate === 'mesPasado') {
                    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
                    return orderDate.getFullYear() === lastMonth.getFullYear() && orderDate.getMonth() === lastMonth.getMonth();}
                else if (filterDate === 'año') {
                    return orderDate.getFullYear() === now.getFullYear();
                }
                return true; // Mostrar todas las órdenes si no se aplica ningún filtro
            };

            setFilteredOrders(orders.filter(order => filterDateObj(order.date)));
        };

        filterOrders();
    }, [orders, filterDate]);

    return (
        <div className="container py-5 mt-4">
            <div className='col-md-offset-1 col-md-12'>
                <div className='row'>
                    <div className='col'>
                        <h4 className='title'>Mis Compras</h4>
                    </div>
                    <div className='col text-right d-flex mb-3 justify-content-between'>

                        <div className=''>
                        <button className='btn btn-default' title='Reload' onClick={() => fetchOrders()}><i className='fa fa-sync-alt'></i></button>

                            <select onChange={(e) => setFilterDate(e.target.value)} className='custom-select' aria-label='Filter By Status'>
                                <option value='todas'>Filtar Por fecha</option>
                                <option value='semana'>Semana</option>
                                <option value='mes'>Este Mes</option>
                                <option value='mesPasado'>Mes Pasado</option>
                                <option value='año'>Año</option>    
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                filteredOrders.map(order => (
                    <div key={order.id} className="card mb-4">
                        <h5>{new Date(order.date).toLocaleDateString()}</h5>
                        <hr />
                        {order.details.map(detail => (
                            <div key={detail.id} className="row mb-3">
                                <div className="col-md-2 d-flex align-items-start">
                                    <img src={detail.image_product} alt={detail.product_name} className="img-fluid" />
                                </div>
                                <div className="col-md-4">
                                    <p className="mb-1 fs-5"><strong>{detail.product_name}</strong></p>
                                    <p className="mb-1">Cantidad: {detail.amount}</p>
                                    <p className="mb-1">Precio: $ {detail.unit_price.toFixed(2)}</p>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                        <span className={`fs-5 badge ${order.shipping_status === 'Entregado' ? 'badge-success' : 'badge-warning'}`}>
                                            {order.shipping_status}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex flex-column align-items-end">
                                    <button className="btn btn-outline-primary mb-2" /* onClick={() => setSelectedDetail(detail)} */>Ver detalle</button>
                                    <button className="btn btn-outline-secondary" onClick={() => addToCart(detail)}>Volver a comprar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default DetailsOrder;
