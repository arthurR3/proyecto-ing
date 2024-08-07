import React, { useEffect, useState } from 'react'
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import exportToExcel from '../../../Componentes/Export_reportes/Export_excel.js'
import LoadingSpinner from '../../../Componentes/Loading/Loading.js'
const URLConnetion = ApiConnection();
function ListaClientes() {
    const navigation = useNavigate()
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const fileName = "Clientes";


    //const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${URLConnetion}/users`);
            const data = await response.data;
            setCustomers(data);
        } catch (error) {
            console.log(error)
            navigation('/Error-500')
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }
    const handleStatus = async (id, status) => {
        setLoading(true);
        try {
            const response = await axios.put(`${URLConnetion}/users/${id}/`, { status });
            setCustomers(customers.map(customer => customer.id === id ? { ...customer, status } : customer))
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
              setLoading(false)
            }, 1000)
          }
    }
    return (
        <div className='container py-5 mt-5'>
            {loading && <LoadingSpinner />}
            <div className='col-md-offset-1 col-md-12'>
                <div className='panel'>
                    <div className='panel-heading'>
                        <div className='row d-flex justify-content-between'>
                            <div className='col'>
                                <h4 className='title'>Lista de clientes</h4>
                            </div>
                            <div className='col text-right d-flex mb-3 justify-content-end'>
                                <div className='btn-group'>
                                    <label  className='form-control' value={'Acciones:'}/>
                                    <button className='btn btn-default' title='Reload' onClick={() => fetchClientes()}><i className='fa fa-sync-alt'></i></button>
                                    <button className='btn btn-default' title='Descargar Excel' onClick={() => exportToExcel(customers, fileName)}><i className='fa fa-file-excel'></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='panle-body  shadow table-responsive'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Nombre del cliente</th>
                                    <th>Telefono</th>
                                    <th>Correo Electronico</th>
                                    <th>Ver Citas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.name}{customer.last_name1} {customer.last_name2}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.email}</td>
                                        <td>
                                            <ul className='action-list'>
                                                <button className='btn btn-success me-3' title='Citas Agendadas' onClick={() => navigation(`/admin/cita-detalle/${customer.id}`)}>
                                                    <i className="fa-regular fa-calendar-check"></i>
                                                </button>
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


{/*  {customer.status ? (
                                                    <button className='btn btn-sm btn-warning' title='Desactivar cliente' onClick={() => handleStatus(customer.id, false)}>
                                                        <i className='fa fa-eye-slash p-2'></i>
                                                        Desactivar
                                                    </button>
                                                ) : (
                                                    <button className='btn btn-sm btn-success pm-3' title='Activar cliente' onClick={() => handleStatus(customer.id, true)}>
                                                        <i className='fa fa-eye p-2'></i>
                                                        Activar
                                                    </button>
                                                )} */}

{/* <CustomModal
        show={showModal}
        centered
        onHide={() => setShowModal(false)}
        title={'Desactivar cliente'}
      >
          <>
            <p>¿Estás seguro de que deseas desactivar la cuenta del cliente {customer.name}{customer.last_name1} {customer.last_name2} ? </p>
            <p>Se le notificará del cambio al cliente y no podra realiza mas uso de su cuenta hasta que sea activado por el administrador de nuevo</p>
            <button className="btn btn-danger me-2 mt-2" onClick={handleVerification}>Cancelar</button>
            <button className="btn btn-warning mt-2" onClick={handleVerification}>Confirmar</button>
          </>
      </CustomModal> */}