import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PasswordStrengthBar from 'react-password-strength-bar';
import ApiConnection from '../../../../Components/Api/ApiConfig';
const URLConnection = ApiConnection();

function ChangePassword() {
    const { correo } = useParams();
    const [showPassword, setShowPassword] = useState('');
    const [showPasswordR, setShowPasswordR] = useState('')
    const [loading, setLoading] = useState(false);
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
            axios.post(`${URLConnection}/users/change-password`, {
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
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error.message);
            alert('Error al actualizar la contraseña. Por favor, inténtalo de nuevo más tarde.');
        }
    }

    return (
        <div className='rounded-lg border bg-white shadow-md mx-auto max-w-md'>
            <div className='flex flex-col space-y-1-5 p-6'>
                <h2 className='text-2xl font-semibold leading-none text-purple-600 tracking-tight'>Actualizar Contraseña</h2>
                <p className='text-sm font-medium text-gray-400'>Ingresa tu nueva contraseña y confirma para actualizar tu cuenta.</p>
            </div>
            <div className='p-6 space-y-4'>
                <form className='needs-validation' onSubmit={handleSubmit}>
                    <div className='space-y-2 text-md'>
                        <label htmlFor='password' className='text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                            Contraseña :
                        </label>
                        <div className='relative'>
                            <input
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${credentials.password.hasError ? "border-red-500" : ''
                                    } ${passwordRequirements.minLength &&
                                        passwordRequirements.uppercase &&
                                        passwordRequirements.lowercase &&
                                        passwordRequirements.number &&
                                        passwordRequirements.specialChar
                                        ? ''
                                        : ''}`}
                                id='password'
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                placeholder='*********'
                                value={credentials.password.value}
                                onChange={validationPassword}
                                onBlur={handleBlur}
                                required
                            />
                           <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa fa-eye'}`}></i>

                            </button>
                        </div>
                        <PasswordStrengthBar password={credentials.password.value} />
                        {credentials.password.hasError && (
                            <div className='text-red-500 text-sm'>
                                La contraseña debe tener al menos {minPassword} caracteres.
                            </div>
                        )}
                        <div className='space-y-1'>
                            <p className={passwordRequirements.uppercase ? 'text-green-500' : 'text-red-500'}>
                                {passwordRequirements.uppercase ? '✔' : '❌'} Mayúscula
                            </p>
                            <p className={passwordRequirements.number ? 'text-green-500' : 'text-red-500'}>
                                {passwordRequirements.number ? '✔' : '❌'} Número
                            </p>
                            <p className={passwordRequirements.specialChar ? 'text-green-500' : 'text-red-500'}>
                                {passwordRequirements.specialChar ? '✔' : '❌'} Carácter especial
                            </p>
                        </div>

                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='repeatPassword' className='text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Repetir Contraseña :</label>
                        <div className='relative'>
                            <input
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${credentials.password.hasError ? "border-red-500" : ""}`}
                                id='repeatPassword'
                                type={showPasswordR ? 'text' : 'password'}
                                name='repeatPassword'
                                placeholder='*********'     
                                value={credentials.repeatPassword.value}
                                onChange={validationPassword}
                                onBlur={handleBlur}
                                required
                            />
                             <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={() => setShowPasswordR(!showPasswordR)}
                            >
                                <i className={`fa ${showPasswordR ? 'fa-eye-slash' : 'fa fa-eye'}`}></i>

                            </button>
                        </div>
                        {credentials.password.value !== credentials.repeatPassword.value && (
                            <div className='text-sm text-red-500'>
                                Las contraseñas no coinciden
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end mt-6 gap-3">
                    <Link to="/login" className='inline-flex items-center rounded-md text-lg font-medium ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-slate-300 text-gray-500 hover:bg-gray-600/90 hover:text-white transition-colors'>
                            Cancelar
                        </Link>
                        <button
                            type='submit'
                            className='inline-flex items-center rounded-md gap-2 text-lg font-medium ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-green-500 text-white hover:bg-green-600/90 transition-colors'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                <i className="fa fa-spinner fa-spin"></i> Verificando
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-circle-check"></i> Cambiar Contraseña
                                </>
                            )}
                        </button>   
                    </div>
                </form>
            </div >
        </div>
    )
}

export default ChangePassword;
