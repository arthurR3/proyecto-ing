import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Componentes/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { toast } from 'react-toastify';

function DatosPersonales({ onClose }) {
    const [formData, setFormData] = useState({
        nombre: '',
        apPaterno: '',
        apMaterno: '',
        telefono: '',
        email: '',
        image: null
    });
    const URLConnection = ApiConnection();
    const { token } = useAuth();
    const data = jwtDecode(token);
    const idUser = data.user.idUser;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        axios.get(`${URLConnection}/users/${idUser}`)
            .then(response => {
                const userData = response.data;
                setFormData({
                    nombre: userData.name,
                    apPaterno: userData.last_name1,
                    apMaterno: userData.last_name2,
                    telefono: userData.phone,
                    email: userData.email
                });
            })
            .catch(error => {
                console.log('Error al obtener los datos del usuario:', error);
            });
    }, [idUser, URLConnection]);

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file && !['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
            toast.error('Solo se permiten archivos con formato png, jpg y jpeg');
            return;
        }
        setFormData(prevFormData => ({ ...prevFormData, image: file }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                dataToSend.append(key, formData[key]);
            }
        });
        try {
            axios.put(`${URLConnection}/users/${idUser}`, dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    if (response.data.success) {
                        toast.success(response.data.message, {
                            position: 'top-right',
                            className: 'mt-5'
                        });
                        onClose();
                    } else {
                        toast.error(response.data.message);
                    }
                })
        } catch (error) {
            console.error('Error saving service', error);
            toast.error('Error al guardar su información. Intente de nuevo');
        }
    };

    return (
        <div className='col-md-12 mb-3'>
            <div className='card card-dates'>
                <div className='card-body'>
                    <h5 className='text-muted'>Información Personal</h5>
                    <hr className='border-left'/>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='nombre' className='form-label fw-bold'>Nombre:</label>
                            <input
                                className='form-control'
                                id='nombre'
                                type='text'
                                name='nombre'
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='apPaterno' className='form-label fw-bold'>Apellido Paterno :</label>
                            <input
                                className='form-control'
                                id='apPaterno'
                                type='text'
                                name='apPaterno'
                                value={formData.apPaterno}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='apMaterno' className='form-label fw-bold'>Apellido Materno :</label>
                            <input
                                className='form-control'
                                id='apMaterno'
                                type='text'
                                name='apMaterno'
                                value={formData.apMaterno}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='telefono' className='form-label fw-bold'>Telefono :</label>
                            <input
                                className='form-control'
                                id='telefono'
                                type='text'
                                name='telefono'
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='email' className='form-label fw-bold'>Correo Electronico :</label>
                            <input
                                className='form-control'
                                id='email'
                                type='text'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='image' className='form-label fw-bold'>Perfil de usuario :</label>
                            <input
                                type="file"
                                className="form-control"
                                name="image"
                                onChange={handleChangeImage}
                            />
                        </div>
                        <div className='d-flex justify-content-center mt-2'>
                            <button type='submit' className='btn btn-success me-4 fs-5'>
                                Guardar
                            </button>
                            <button type='button' className='btn btn-secondary fs-5' onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DatosPersonales;
