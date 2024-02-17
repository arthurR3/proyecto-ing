import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PasswordStrengthBar from 'react-password-strength-bar';

function ChangePassword() {
    const { correo } = useParams();
    const navigation = useNavigate();
    const minPassword = 8;
    const [credentials, setCredentials] = React.useState({

        password: {
            value: '',
            hasError: false,
        },
        repeatPassword: {
            value: '',
            hasError: false
        }
    });


    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const validationPassword = (evt) => {
        const { name, value } = evt.target;
        if (name === 'password') {
            setCredentials((prevCredentials) => ({
                ...prevCredentials,
                [name]: {
                    value,
                    hasError: value.length < minPassword,
                },
            }));

            const hasMinLength = value.length >= minPassword;
            const hasUppercase = /[A-Z]/.test(value);
            const hasLowercase = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);

            setPasswordRequirements({
                minLength: hasMinLength,
                uppercase: hasUppercase,
                lowercase: hasLowercase,
                number: hasNumber,
                specialChar: hasSpecialChar,
            });
        }
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: {
                value,
                hasError: value.length < minPassword,
            },
        }));
    }
    function handleBlur() {
        const passwordHasError = credentials.password.value.length < minPassword;
        const repeatPassHasError = credentials.repeatPassword.value !== credentials.password.value;

        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            password: {
                ...prevCredentials.password,
                hasError: passwordHasError,
            },
            repeatPassword: {
                ...prevCredentials.repeatPassword,
                hasError: repeatPassHasError,
            },
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (credentials.password.value !== credentials.repeatPassword.value) {
            toast.error('Las contraseñas no coinciden')
            return
        }
        try {
            axios.post("http://localhost:5000/api/v1/users/change-password", {
                email: correo,
                newPassword: credentials.password.value
            })
                .then(response => {
                    if (response.data.success) {
                        toast.success(response.data.message, {
                            position: 'top-right',
                            className: 'mt-5'
                        })
                        navigation('/Login')
                    } else {
                        const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                        toast.error('Ingreso fallido. ' + errorMessage, {
                            position: 'top-center',
                            className: 'mt-5'
                        });
                    }
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 404) {
                            toast.warn(error.response.data.message, {
                                position: 'top-center',
                                className: 'mt-5'
                            })
                        } else {
                            // Otro tipo de error del servidor
                            alert('Error del servidor: ' + error.response.message);
                        }
                    } else if (error.message.toLowerCase() === 'network error') {
                        // Error de red, no hay conexión al servidor
                        console.warn(error.message);
                        alert('El Servidor no esta funcionando. Intente mas tarde', error.message);
                    } else {
                        // Otro tipo de error que no es del servidor (puede ser local)
                        console.log('Error:', error.message);
                        alert('Error inesperado. Por favor, inténtalo de nuevo más tarde.');

                    }
                })
            /* const response = await axios.get(`http://localhost:5000/api/v1/users/`);
            const user = response.data.find(user => user.email === correo);
            console.log(user)
            console.log(credentials.password.value)
            const updatePassword = await axios.put(`http://localhost:5000/api/v1/users/${user.id}`, {
                password: credentials.password.value
            })
            if (updatePassword.data.success) {
                toast.success('Contraseña actualizada correctamente', {
                    position: 'top-right'
                });

            } else {
                toast.error('Error al actualizar la contraseña: ' + updatePassword.data.message);
            } */
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error.message);
            alert('Error al actualizar la contraseña. Por favor, inténtalo de nuevo más tarde.');
        }
    }

    return (
        <div className=' mt-auto m-5 d-flex align-items-center justify-content-center'>
            <div className='login rounded align-text-center'>
                <h2 className='mb-3 text-center pb-5'>Actualizar Contraseña</h2>
                <form className='needs-validation' onSubmit={handleSubmit}>
                    <div className='form-group mb-2'>
                        <label htmlFor='password' className='form-label fw-bold'>
                            Contraseña :
                        </label>
                        <input
                            className={`form-control ${credentials.password.hasError ? 'is-invalid' : ''
                                } ${passwordRequirements.minLength &&
                                    passwordRequirements.uppercase &&
                                    passwordRequirements.lowercase &&
                                    passwordRequirements.number &&
                                    passwordRequirements.specialChar
                                    ? 'password-valid'
                                    : ''}`}
                            id='password'
                            type='password'
                            name='password'
                            value={credentials.password.value}
                            onChange={validationPassword}
                            onBlur={handleBlur}
                            required
                        />
                        <PasswordStrengthBar password={credentials.password.value} />
                        {credentials.password.hasError && (
                            <div className='invalid-feedback'>
                                La contraseña debe tener al menos {minPassword} caracteres.
                            </div>
                        )}
                        {/* Mensajes dinámicos */}
                        <div className='password-requirements'>
                            <p className={passwordRequirements.uppercase ? 'valid' : 'invalid'}>
                                {passwordRequirements.uppercase ? '✔' : '❌'} Mayúscula
                            </p>
                            <p className={passwordRequirements.number ? 'valid' : 'invalid'}>
                                {passwordRequirements.number ? '✔' : '❌'} Número
                            </p>
                            <p className={passwordRequirements.specialChar ? 'valid' : 'invalid'}>
                                {passwordRequirements.specialChar ? '✔' : '❌'} Carácter especial
                            </p>
                        </div>
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='repeatPassword' className='form-label fw-bold'>Repetir Contraseña :</label>
                        <input
                            className={`form-control was-validated ${credentials.repeatPassword.hasError ? 'is-invalid' : ''}`}
                            id='repeatPassword'
                            type='password'
                            name='repeatPassword'
                            value={credentials.repeatPassword.value}
                            onChange={validationPassword}
                            onBlur={handleBlur}
                            required
                        />
                        {credentials.password.value !== credentials.repeatPassword.value && (
                            <div className='invalid-feedback'>
                                Las contraseñas no coinciden
                            </div>
                        )}
                    </div>
                    <div className='col-12 text-center mt-2'>
                        {/* Fila adicional para centrar el botón */}
                        <div className='row justify-content-center'>
                            <div className='col-6'>
                                <button type='submit' onClick={handleSubmit} className='btn btn-success align-items-center mt-2 fs-5'>
                                    <i className=' fa fa-password'></i>
                                    Cambiar contraseña
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        </div>
    )
}

export default ChangePassword;
