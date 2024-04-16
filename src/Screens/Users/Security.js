import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Componentes/Context/AuthContext';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

function SecurityScreen() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { token } = useAuth();
    const URLConnection = ApiConnection();
    const data = jwtDecode(token);
    const idUser = data.user.idUser;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        axios.post(`${URLConnection}/users/change-password/old/${idUser}`, {
            oldPassword: oldPassword,
            newPassword: newPassword
        })
        .then(response => {
            toast.success('Contraseña actualizada correctamente');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        })
        .catch(error => {
            setError(error.response.data.message);
            toast.error(error.response.data.message);
        });
    };

    return (
        <div className='mt-4'>
            <div className='row'>
                <div className='col-md-3'></div>
                <div className='col-md-6 formulario'>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='oldPassword' className='form-label fw-bold'>Contraseña anterior:</label>
                            <input
                                className='form-control'
                                id='oldPassword'
                                type='password'
                                name='oldPassword'
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='newPassword' className='form-label fw-bold'>Nueva contraseña:</label>
                            <input
                                className='form-control'
                                id='newPassword'
                                type='password'
                                name='newPassword'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='confirmPassword' className='form-label fw-bold'>Confirmar nueva contraseña:</label>
                            <input
                                className='form-control'
                                id='confirmPassword'
                                type='password'
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='d-flex justify-content-center mt-2'>
                            <button type='submit' className='btn btn-primary me-2 fs-5'>
                                Actualizar Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SecurityScreen;
