import React, { useEffect, useState } from 'react'
import ApiConnection from '../../../Components/Api/ApiConfig';
import { useAuth } from '../../../Components/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import DomicilioUser from './Domicilio';

const Perfil = () => {
    const URLConnection = ApiConnection();
    const { token } = useAuth()
    const [user, setUser] = useState([])
    const [address, setAddress] = useState([]);
    const [userToken, setUserToken] = useState([])
    const [editando, setEditando] = useState(false)
    const [usuarioEditado, setUsuarioEditado] = useState([])
    const [formType, setFormType] = useState('');
    useEffect(() => {
        if (token) {
            const decodeToken = jwtDecode(token)
            setUserToken(decodeToken.user)
        }
    }, [token])


    useEffect(() => {
        if (userToken && userToken.idUser) {
            const fetchUserInfo = async () => {
                if (userToken && userToken.idUser) {
                    const id_user = userToken.idUser
                    try {
                        const response = await axios.get(`${URLConnection}/users/${id_user}`)
                        const reponse2 = await axios.get(`${URLConnection}/address/${id_user}`)
                        setUser(response.data)
                        setUsuarioEditado(response.data)
                        setAddress(reponse2.data)
                    } catch (error) {
                        console.log('Error getting user', error)
                    }
                }
            }

            fetchUserInfo()
        }
    }, [userToken, token])


    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target
        console.log(name, value)
        setUsuarioEditado({ ...usuarioEditado, [name]: value })
    }


    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-6xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden'>
                <div className='md:flex'>
                    <div className='md:flex shrink-0 bg-purple-600 md:w-48 flex flex-col items-center justify-center p-6'>
                        <img className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg' src={user.image} alt={user.name} />
                        <h2 className='mt-4 text-xl font-semibold text-white'>{user.name} {user.last_name1}</h2>
                        <p className='mt-2 text-purple-200'>Cliente Frecuente</p>
                    </div>
                    <div className='p-8 w-full'>
                        <div className='flex justify-between items-center mb-6'>
                            <h1 className='text-2xl font-bold text-gray-900'>Perfil de Usuario</h1>
                            {!editando ? (
                                <button className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300' onClick={() => setEditando(true)}>Editar Perfil</button>

                            ) : (
                                <div className="space-y-2 sm:space-x-2 sm:space-y-0 flex flex-col sm:flex-row">
                                    <button className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white text-sm sm:text-base rounded-md hover:bg-green-700 transition duration-300">
                                        Guardar
                                    </button>
                                    <button
                                        className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white text-sm sm:text-base rounded-md hover:bg-red-700 transition duration-300"
                                        onClick={() => setEditando(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>

                            )}
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Información Personal</h3>
                                <div className='space-y-2'>
                                    <p className='text-gray-600'>
                                        <span className='font-semibold me-1'>Correo Electronico:</span>{editando ? (
                                            <input type='email' name='email' value={usuarioEditado.email} onChange={(e) => setUsuarioEditado({ ...usuarioEditado, email: e.target.value })}
                                                className='ml-2 p-1 border rounded'
                                            />
                                        ) : user.email}
                                    </p>
                                    <p className='text-gray-600'>
                                        <span className='font-semibold me-1'>Telefono:</span> {editando ? (
                                            <input name='telefono' id='telefono' type='tel' value={usuarioEditado.phone} onChange={(e) => handleChange(e)}
                                                className='ml-2 p-1 border rounded'
                                            />
                                        ) : user.phone}
                                    </p>
                                    <hr />
                                </div>
                            </div>
                            <div>
                                <p className='text-gray-600'>
                                    <span className='font-semibold me-1'>Dirección:</span>
                                    <span>{address ? `Calle ${address.street}, ${address.cologne}, ${address.municipality}, 43000` : 'Sin dirección agregada'}</span>

                                    <button className="ml-2 text-purple-600 hover:text-purple-800" onClick={() => { setFormType('Domicilio') }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                </p>
                                <hr className='mt-12' />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='flex justify-center mt-8'>
                    <p className='text-gray-600'>
                        *Los cambios realizados en este formulario no se aplicarán hasta que selecciones el botón "Guardar".
                    </p>
                </div> */}
            </div>
            <div className='max-w-6xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden mt-4'>

                {formType === 'Domicilio' && (

                    <DomicilioUser />
                )}
            </div>

        </div>
    )
}

export default Perfil