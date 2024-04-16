import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import { useAuth } from '../../../Componentes/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
const URLConnection = ApiConnection();

const DetailsOrder = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const data = jwtDecode(token)
    const idUser = data.user.idUser
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${URLConnection}/sales/${idUser}`); // Obtener las órdenes del usuario desde tu servicio
                setOrders(response.data.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h1 className="text-center mb-5">Compras</h1>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Order #</th>
                                    <th>Producto</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Fecha de la compra</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    order.details.map((detail, index2) => (
                                        <tr key={`${index}-${index2}`}>
                                            <td>{order.id}</td>
                                            <td>{detail.product_name} - {detail.amount}</td>
                                            <td><span className={`badge ${order.shipping_status === 'En proceso' ? 'bg-warning' : 'bg-success'}`}>{order.shipping_status}</span></td>
                                            <td>${(order.total).toFixed(2)}</td>
                                            <td>{new Date(order.date).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsOrder;
