import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Componentes/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { toast } from 'react-toastify';

function DatosPersonales() {
    const [dataUser, setData] = useState([]);
    const [nombre, setNombre] = useState('');
    const [apPaterno, setApPaterno] = useState('');
    const [apMaterno, setApMaterno] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [editando, setEditando] = useState(false);
    const URLConnection = ApiConnection();
    const { token } = useAuth();
    const data = jwtDecode(token);
    const idUser = data.user.idUser;

    const handleEditar = () => {
        setEditando(true);
    };

    const handleCancelar = () => {
        setEditando(false);
    };

    useEffect(() => {
        // Llamar a la API para obtener los datos del usuario
        axios.get(`${URLConnection}/users/${idUser}`)
            .then(response => {
                const userData = response.data;
                if (!nombre) setNombre(userData.name);
                if (!apPaterno) setApPaterno(userData.last_name1);
                if (!apMaterno) setApMaterno(userData.last_name2);
                if (!telefono) setTelefono(userData.phone);
                if (!email) setEmail(userData.email);
            })
            .catch(error => {
                console.log('Error al obtener los datos del usuario:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviar la solicitud a la API para actualizar los datos del usuario
        axios.put(`${URLConnection}/users/${idUser}`, {
            name: nombre,
            last_name1: apPaterno,
            last_name2: apMaterno,
            phone: telefono,
            email: email
        })
        .then(response => {
            //console.log('Datos actualizados correctamente:', response.data);
            toast.success('Datos actualizados correctamente', {
                position: 'top-right',
                className: 'mt-5'
            });
            setEditando(false);
        })
        .catch(error => {
            toast.error('Error al actualizar los datos del usuario')
            //console.log('Error al actualizar los datos del usuario:', error);
        });
    };

    return (
        <div className='mt-4'>
            <div className='row'>
                <div className='col-md-3'></div>
                <div className='col-md-8 formulario'>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='nombre' className='form-label fw-bold'>Nombre:</label>
                            <input
                                className='form-control'
                                id='nombre'
                                type='text'
                                name='nombre'
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                disabled={!editando}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='ApPaterno' className='form-label fw-bold'>Apellido Paterno :</label>
                            <input
                                className='form-control'
                                id='ApPaterno'
                                type='text'
                                name='ApPaterno'
                                value={apPaterno}
                                onChange={(e) => setApPaterno(e.target.value)}
                                required
                                disabled={!editando}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='ApMaterno' className='form-label fw-bold'>Apellido Materno :</label>
                            <input
                                className='form-control'
                                id='ApMaterno'
                                type='text'
                                name='ApMaterno'
                                value={apMaterno}
                                onChange={(e) => setApMaterno(e.target.value)}
                                required
                                disabled={!editando}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='telefono' className='form-label fw-bold'>Telefono :</label>
                            <input
                                className='form-control'
                                id='telefono'
                                type='text'
                                name='telefono'
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                                disabled={!editando}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='correo' className='form-label fw-bold'>Correo Electronico :</label>
                            <input
                                className='form-control'
                                id='correo'
                                type='text'
                                name='correo'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={!editando}
                            />
                        </div>
                        <div className='d-flex justify-content-center mt-2'>
                            {!editando && (
                                <button type='button' className='btn btn-success me-2 fs-5' onClick={handleEditar}>
                                    Editar
                                </button>
                            )}
                            {editando && (
                                <>
                                    <button type='submit' className='btn btn-primary me-2 fs-5'>
                                        Guardar
                                    </button>
                                    <button type='button' className='btn btn-secondary fs-5' onClick={handleCancelar}>
                                        Cancelar
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DatosPersonales;
