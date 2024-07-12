import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import { useAuth } from '../../../Componentes/Context/AuthContext';
import { useCart } from '../../../Componentes/useCart';
import CustomModal from '../../../Componentes/Modal';
import { jwtDecode } from 'jwt-decode';
const URLConnection = ApiConnection();

const DetailsOrder = () => {
    const { token } = useAuth();
    const { addToCart } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [filterDate, setFilterDate] = useState('todas');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    const data = jwtDecode(token);
    const idUser = data.user.idUser;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${URLConnection}/sales/${idUser}`);
                setOrders(response.data.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        // Filtrar las órdenes cuando cambie el filtro de fecha
        const currentDate = new Date();
        const currentWeek = currentDate.getDate() - currentDate.getDay();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.date);
            const orderWeek = orderDate.getDate() - orderDate.getDay();
            const orderYear = orderDate.getFullYear();
            const orderMonth = orderDate.getMonth();

            if (filterDate === 'semana') {
                return orderYear === currentYear && orderMonth === currentMonth && orderWeek === currentWeek;
            } else if (filterDate === 'mes') {
                return orderYear === currentYear && orderMonth === currentMonth;
            } else if (filterDate === 'año') {
                return orderYear === currentYear;
            }

            return true; // Mostrar todas las órdenes si no se aplica ningún filtro
        });

        setFilteredOrders(filteredOrders);
    }, [orders, filterDate]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="navbar bg-body-tertiary nav-color m-3">
                        <div className="container-fluid">
                            <a className="navbar-brand">Mis Compras</a>
                            <select
                                className="form-select me-2"
                                aria-label="Filtrar por fecha"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            >
                                <option value="todas">Todas</option>
                                <option value="semana">Esta semana</option>
                                <option value="mes">Mes pasado</option>
                                <option value="año">Año pasado</option>
                            </select>
                        </div>
                    </div>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center">No hay productos disponibles en estas fechas.</div>
                    ) : (
                        filteredOrders.map((filteredOrder, index) => (
                            filteredOrder.details.map((detail, index2) => (
                                <div key={`${index}-${index2}`} className="navbar bg-body-tertiary nav-color m-3">
                                    <div className="container-fluid">
                                        <a className="navbar-brand">{new Date(filteredOrder.date).toLocaleDateString()}</a>
                                        <hr />
                                        <div className="row">
                                            <div className="col">
                                                <button
                                                    className="btn btn-primary me-2"
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setSelectedDetail(detail);
                                                    }}
                                                >
                                                    Detalle Compra
                                                </button>

                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => addToCart({ id: detail.id_product, name: detail.product_name, image: detail.image_product, price: detail.unit_price })}
                                                >
                                                    Volver a Comprar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='navbar bg-body-tertiary'>
                                        <img src={detail.image_product} />
                                        <div className='row'>
                                            <div className='col'>
                                                <span className={`badge ${filteredOrder.shipping_status === 'En proceso' ? 'bg-warning' : 'bg-success'}`}>{filteredOrder.shipping_status}</span>
                                                <h4>{detail.product_name}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ))
                    )}

                    <CustomModal show={showModal} onHide={() => setShowModal(false)}
                        title='Detalle de la Compra'
                        centered
                    >
                        <>
                            <p><strong>Producto:</strong> {selectedDetail?.product_name}</p>
                            <p><strong>Cantidad:</strong> {selectedDetail?.amount}</p>
                            <p><strong>Precio Unitario: $ </strong> {(selectedDetail?.unit_price)}</p>
                            <p><strong>Subtotal: $ </strong> {selectedDetail?.subtotal}</p>
                        </>

                    </CustomModal>
                </div>
            </div>
        </div>
    );
};

export default DetailsOrder;

