import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Componentes/Context/AuthContext';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const URLConnection = ApiConnection();

function SecurityScreen({ onClose }) {
    const [passwordActual, setPasswordActual] = useState('');
    const [nuevoPassword, setNuevoPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const { token } = useAuth();
    const data = jwtDecode(token);
    const idUser = data.user.idUser;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nuevoPassword !== confirmarPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        axios.post(`${URLConnection}/users/change-password/old/${idUser}`, {
            oldPassword: passwordActual,
            newPassword: nuevoPassword
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
            .catch(error => {
                const errorMessage = error.response?.data?.message || 'Error al actualizar la contraseña';
                toast.error(errorMessage);
            });
    };

    return (
        <div className='col-md-12 mb-3'>
            <div className='card card-dates'>
                <div className='card-body'>
                    <h5 className='text-muted'>Seguridad</h5>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='passwordActual' className='form-label fw-bold'>Contraseña Actual:</label>
                            <input
                                className='form-control'
                                id='passwordActual'
                                type='password'
                                name='passwordActual'
                                value={passwordActual}
                                onChange={(e) => setPasswordActual(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='nuevoPassword' className='form-label fw-bold'>Nueva Contraseña:</label>
                            <input
                                className='form-control'
                                id='nuevoPassword'
                                type='password'
                                name='nuevoPassword'
                                value={nuevoPassword}
                                onChange={(e) => setNuevoPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='confirmarPassword' className='form-label fw-bold'>Confirmar Contraseña:</label>
                            <input
                                className='form-control'
                                id='confirmarPassword'
                                type='password'
                                name='confirmarPassword'
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)}
                                required
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

export default SecurityScreen;
