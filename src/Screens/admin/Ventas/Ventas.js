import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../Componentes/Loading/Loading.js'; // Asegúrate de tener este componente
import ApiConnection from '../../../Componentes/Api/ApiConfig';

const URLConnection = ApiConnection();

const GestionVentas = () => {
    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [deliveredSales, setDeliveredSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('En proceso');

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get(`${URLConnection}/sales`);
                setSales(response.data);
                setFilteredSales(response.data.filter(sale => sale.shipping_status === 'En proceso'));
                setDeliveredSales(response.data.filter(sale => sale.shipping_status === 'Entregado'));
                setLoading(false);
            } catch (error) {
                toast.error('Error al obtener las ventas');
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    const handleStatusChange = async (saleId, status) => {
        try {
            await axios.put(`${URLConnection}/sales/${saleId}`, { shipping_status: status });
            const updatedSales = sales.map(sale =>
                sale.id === saleId ? { ...sale, shipping_status: status } : sale
            );
            setSales(updatedSales);
            setFilteredSales(updatedSales.filter(sale => sale.shipping_status === 'En proceso'));
            setDeliveredSales(updatedSales.filter(sale => sale.shipping_status === 'Entregado'));
            toast.success('Estado de la venta actualizado');
        } catch (error) {
            toast.error('Error al actualizar el estado de la venta');
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className='container mt-4 py-5'>
            <div className='row mb-3'>
                <div className='col'>
                    <h4 className='title'>Gestión de Ventas</h4>
                </div>
                <div className='col text-end'>
                    <div className=''>
                        <button
                            className='btn btn-outline-secondary'
                            type='button'
                            onClick={() => handleFilterChange('En proceso')}
                        >
                            En proceso
                        </button>
                        <button
                            className='btn btn-outline-secondary ms-2'
                            type='button'
                            onClick={() => handleFilterChange('Entregado')}
                        >
                            Entregado
                        </button>
                    </div>
                </div>
            </div>
            <hr/>

            {/* Tabla para Ventas en Proceso */}
            {filter === 'En proceso' && (
                <div>
                    <h5>Ventas en Proceso</h5>
                    <table className='table shadow align-items-center table-flush'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>ID Venta</th>
                                <th>Usuario</th>
                                <th>Total</th>
                                <th>Fecha</th>
                                <th>Estado de Envío</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map(sale => (
                                <tr key={sale.id}>
                                    <td>{sale.id}</td>
                                    <td>{`${sale.Usuario.name} ${sale.Usuario.last_name1} ${sale.Usuario.last_name2}`}</td>
                                    <td>${sale.total.toFixed(2)}</td>
                                    <td>{new Date(sale.date).toLocaleDateString()}</td>
                                    <td>{sale.shipping_status}</td>
                                    <td>
                                        <button
                                            className='btn btn-success btn-sm'
                                            onClick={() => handleStatusChange(sale.id, 'Entregado')}
                                        >
                                            Marcar como Entregado
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Tabla para Ventas Entregadas */}
            {filter === 'Entregado' && (
                <div>
                    <h5>Ventas Entregadas</h5>
                    <table className='table shadow align-items-center table-flush'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>ID Venta</th>
                                <th>Usuario</th>
                                <th>Total</th>
                                <th>Fecha</th>
                                <th>Estado de Envío</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveredSales.map(sale => (
                                <tr key={sale.id}>
                                    <td>{sale.id}</td>
                                    <td>{`${sale.Usuario.name} ${sale.Usuario.last_name1} ${sale.Usuario.last_name2}`}</td>
                                    <td>${sale.total.toFixed(2)}</td>
                                    <td>{new Date(sale.date).toLocaleDateString()}</td>
                                    <td>{sale.shipping_status}</td>
                                    <td>
                                        {/* Aquí puedes agregar botones adicionales si es necesario */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GestionVentas;
