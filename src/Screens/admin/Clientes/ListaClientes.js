import React, { useEffect, useState } from 'react'
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const URLConnetion = ApiConnection();
function ListaClientes() {
    const navigation = useNavigate()
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch(`${URLConnetion}/users`);
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                navigation('/Error-500')
            }
        }
        fetchClientes();
    }, []);
    return (
        <div className='container mt-4 py-5'>
            <div className='col-md-offset-1 col-md-10'>
                <div className='panel'>
                    <div className='panel-heading'>
                        <div className='row'>
                            <div className='col col-sm-3 col-xs-12'>
                                <h4 className='title'>Lista de clientes</h4>
                            </div>
                            <div className='col-sm-9 col-xs-12 text-right'>
                                <div className='btn-group'>
                                    <input type='text' className='form-control' placeholder='Search' />
                                    <button className='btn btn-default' title='Reload'><i className='fa fa-sync-alt'></i></button>
                                    <button className='btn btn-default' title='PDF'><i className='fa fa-file-pdf'></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='panle-body table-responsive'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre del cliente</th>
                                    <th>Edad</th>
                                    <th>Telefono</th>
                                    <th>Correo Electronico</th>
                                    <th>Citas Agendadas</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.name}{customer.last_name1} {customer.last_name2}</td>
                                        <td>{customer.age}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.email}</td>
                                        <td className='table-cell-center'>
                                            <button className='btn btn-success' onClick={() => navigation(`/admin/cita-detalle/${customer.id}`)}>
                                                <i className="fa-regular fa-calendar-check"></i>
                                            </button>
                                        </td>

                                        <td>
                                            <ul className='action-list'>
                                                <button className='btn btn-sm btn-primary'><i className='fa fa-edit'></i></button>
                                                <button className='btn btn-sm btn-danger'><i className='fa fa-trash'></i></button>
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListaClientes