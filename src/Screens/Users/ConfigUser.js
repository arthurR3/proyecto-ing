import React, { useEffect, useState } from 'react';
import '../../CSS/config.css';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { useAuth } from '../../Componentes/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Componentes/Loading/Loading.js'
import SecurityScreen from './Security';
import DatosPersonales from './DatosPersonales';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URLConnection = ApiConnection();

function ConfigUser() {
    const { token } = useAuth();
    const navigation = useNavigate()
    const data = jwtDecode(token);
    const [customer, setCustomers] = useState([]);
    const [address, setAddress] = useState([]);
     const [formType, setFormType] = useState('');
    const [loading, setLoading] = useState(false);
    const idUser = data.user.idUser

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [response, response2] = await Promise.all([
                    axios.get(`${URLConnection}/users/${idUser}`),
                    axios.get(`${URLConnection}/address/${idUser}`),
                ]);
                setCustomers(response.data);
                setAddress(response2.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Si la respuesta de la dirección devuelve un 404, significa que no hay dirección registrada
                    setAddress(null);
                }else{
                console.error('Error fetching data', error);
                toast.error('Error al obtener los datos:', error.message);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [idUser]);
    
    return (
        <div className='container py-5 mt-4'>
            <h4 className='title'>Perfil de usuario</h4>
            <hr className='mb-0' />
            <button className='btn'>Mis Citas</button>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className='row'>
                    <div className='col-md-12 mb-3'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className='row'>
                                    <div className='col-md-4 d-flex flex-column align-items-center text-center'>
                                        <img src={customer.image ? customer.image : 'https://bootdey.com/img/Content/avatar/avatar7.png'} alt='Usuario' className='rounded-circle mb-3' />
                                        <div className=''>
                                            <h4>{customer.name}</h4>
                                            <p className='text-secondary mb-0'>{customer.email}</p>
                                            <p className='text-muted font-size-sm mb-0'>ID para Skill Alexa</p>
                                            <p className='text-muted'>#{customer.code}</p>
                                        </div>
                                        <ul className='list-group list-group-flush w-100'>
                                            <li className='list-group-item d-flex justify-content-between flex-wrap'>
                                                <h6 className='mb-0'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                                                        <path fill="#29b6f6" fillRule="evenodd" d="M24,4C12.96,4,4.01,12.954,4.01,24 c0,10.141,7.545,18.519,17.325,19.823v-4.03c0-1.136-0.716-2.158-1.793-2.519c-5.643-1.897-9.68-7.293-9.531-13.611 c0.181-7.692,6.444-13.74,14.133-13.662c7.662,0.078,13.849,6.316,13.849,14c0,0.72-0.056,1.44-0.164,2.151 c-1.713,11.291-16.412,17.637-16.492,17.672C22.208,43.939,23.097,44,24,44c11.04,0,19.99-8.954,19.99-20S35.04,4,24,4" clipRule="evenodd"></path>
                                                    </svg>
                                                    Skill
                                                </h6>
                                                <span className="text-secondary">https://skillAlexa.com</span>
                                            </li>
                                            <li className='list-group-item d-flex justify-content-center flex-wrap'>
                                                <button className='btn btn-warning mt-3'  onClick={() => navigation(`/User-info/address/${customer.email}`)}>  <i className="fa-solid fa-location-dot me-3"></i>Actualizar dirección</button>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className='col-md-8'>
                                        <div className='row'>
                                            <div className='col-sm-4'>
                                                <h6 className='mb-0'>Nombre Completo</h6>
                                            </div>
                                            <div className='col-sm-8 text-secondary'>
                                                {customer.name} {customer.last_name1} {customer.last_name2}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-sm-4'>
                                                <h6 className='mb-0'>Correo Electronico</h6>
                                            </div>
                                            <div className='col-sm-8 text-secondary'>
                                                {customer.email}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-sm-4'>
                                                <h6 className='mb-0'>Télefono (Celular)</h6>
                                            </div>
                                            <div className='col-sm-8 text-secondary'>
                                                {customer.phone}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-sm-4'>
                                                <h6 className='mb-0'>Dirección:</h6>
                                            </div>
                                            <div className='col-sm-8 text-secondary'>
                                            {address ? `Calle ${address.street}, ${address.cologne}, ${address.municipality}, 43000` : 'Sin dirección agregada'}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-sm-6'>
                                                <button className='btn btn-warning mt-2' onClick={() => setFormType('updateDetails')}>
                                                    <i className="fa-solid fa-pen-to-square me-3"></i>Actualizar Datos
                                                </button>
                                            </div>
                                            <div className='col-sm-6'>
                                                <button className='btn btn-danger mt-2' onClick={() => setFormType('updatePassword')}>
                                                <i className="fa-solid fa-lock me-3"></i>Actualizar contraseña
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {formType === 'updatePassword' && (
                        <SecurityScreen onClose={() => setFormType('')} />
                    )}
                    {formType === 'updateDetails' && (
                        <DatosPersonales onClose={() => setFormType('')} />
                    )}
                </div>
            )}
        </div>
    );
}

export default ConfigUser;
