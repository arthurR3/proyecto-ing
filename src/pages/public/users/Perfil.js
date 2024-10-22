import React, { useEffect, useState } from 'react'
import ApiConnection from '../../../Components/Api/ApiConfig';
import { useAuth } from '../../../Components/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Perfil = () => {
    const URLConnection = ApiConnection();
    const { token } = useAuth()
    const [user, setUser] = useState([])
    const [userToken, setUserToken] = useState([])
    const [editando, setEditando] = useState(false)
    const [usuarioEditado, setUsuarioEditado] = useState(user)
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
                        setUser(response.data)
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
                                <div className="space-x-2">
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
                                        Guardar
                                    </button>
                                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300" onClick={() => setEditando(false)}>
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
                                        <span className='font-medium'>Correo Electronico:</span>{editando ? (
                                            <input type='email' name='email' value={usuarioEditado.email} onChange={(e) =>handleChange(e)} 
                                                className='ml-2 p-1 border rounded'
                                            />
                                        ) :  user.email }
                                    </p>
                                    <p className='text-gray-600'>
                                        <span>Telefono:</span> {editando ?(
                                            <input name='telefono' id='telefono' type='tel' value={usuarioEditado.phone} onChange={(e) => handleChange(e)}
                                                className='ml-2 p-1 border rounded'
                                            />
                                        ): user.phone}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3>Servicios Favoritos</h3>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            Perfil
        </div>
    )
}

export default Perfil