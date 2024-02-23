import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const forgetPassword = (email, onSuccess, onError) => {
    if (!email) {
        toast.error('Ingrese un correo electrónico por favor!', {
            position: 'bottom-center',
            className: 'p-2'
        });
        return;
    }

        axios.post("http://localhost:5000/api/v1/users/recover-password", {
            email: email
        })
            .then(response => {
                if (response.data.success) {
                    toast.success(response.data.message, {
                        position: 'top-right',
                        className: 'mt-5'
                    });
                    onSuccess(email);
                } else {
                    const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                    toast.error('Ingreso fallido. ' + errorMessage, {
                        position: 'top-center',
                        className: 'mt-5'
                    });
                    onError();
                }
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 402) {
                        toast.warn(error.response.data.message, {
                            position: 'top-center',
                            className: 'mt-5'
                        });
                    } else {
                        alert('Error del servidor: ' + error.response.message);
                    }
                } else if (error.message.toLowerCase() === 'network error') {
                    console.warn(error.message);
                    alert('Error de red. Por favor, verifica tu conexión a Internet.', error.message);
                } else {
                    console.log('Error:', error.message);
                    alert('Error inesperado. Por favor, inténtalo de nuevo más tarde.');
                }
            onError();
        });
};

export default forgetPassword;
