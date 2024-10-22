import React, { useRef, useState } from 'react'
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import ApiConnection from '../../../Components/Api/ApiConfig.js';


const emailRegexp = new RegExp(/[^@\t\r\n]+@[^@\t\r\n]+\.[^@\t\r\n]+/);
const minPassword = 8;

const Register = () => {
    const toast = useRef(null)
    const URLConnection = ApiConnection();
    const navigation = useNavigate();
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('')
    const [ApPaterno, setApPaterno] = useState('')
    const [ApMaterno, setApMaterno] = useState('')
    const [telefono, setTelefono] = useState('')
    const [formData, setFormData] = useState('')
    const [showPassword, setShowPassword] = useState('')
    const [showPasswordR, setShowPasswordR] = useState('')
    const [isChecked, setIsChecked] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [customAnswer, setCustomAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [question] = useState([
        { id: 'color-favorite', value: '¿Cuál es tu color favorito?' },
        { id: 'movie-favorite', value: '¿Cuál es tu pelicula favorita?' },
        { id: 'peet-favorite', value: '¿Nombre de tu mascota?' },

    ])
    const handleQuestionChange = (e) => {
        const selectedQuestionId = e.target.value;
        if (selectedQuestionId !== 'default') {
            const selectedQuestion = question.find((q) => q.id === selectedQuestionId);
            setSelectedQuestion(selectedQuestion);
            setCustomAnswer('');
        } else {
            setSelectedQuestion(null);
            setCustomAnswer('');
        }
    };

    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const [credentials, setCredentials] = React.useState({
        email: {
            value: '',
            hasError: false,
        },
        password: {
            value: '',
            hasError: false,
        },
        repeatPassword: {
            value: '',
            hasError: false
        }
    });

    const handleChange = async (e, setterFunction) => {
        // Elimina espacios en blanco antes y al final
        const value = e.target.value;

        if (/^[a-zA-Z\u00C0-\u017F\s']*$/u.test(value)) {
            setterFunction(value);
            setError('')

        } else if (value.length < 2) {
            setError('Mínimo 3 letras');
        }
    }

    const validationPhone = (e) => {
        const value = e.target.value.trim();
        if (/^[0-9]{0,10}$/.test(value)) {
            setTelefono(value);
        }
    }

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

    /*
    De manera síncrona valuó si el valor del campo no es un correo valido y evita
    que el usuario reciba un error sin haber terminado de poner el valor.
*/
    function handleBlur() {
        const emailHasError = !emailRegexp.test(credentials.email.value);
        const passwordHasError = credentials.password.value.length < minPassword;
        const repeatPassHasError = credentials.repeatPassword.value !== credentials.password.value;

        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            email: {
                ...prevCredentials.email,
                hasError: emailHasError,
            },
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const currentDate = new Date();
        const selectedDate = new Date(formData);

        if (!nombre || !ApPaterno || !ApMaterno || !telefono || !credentials.email.value || !credentials.password.value || !credentials.repeatPassword.value || !question) {
            setLoading(false)
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'Completa todos los campos!', life: 3000 });
            return;
        }
        if (credentials.email.value === '' || credentials.password.value === '' || credentials.repeatPassword.value === '' || customAnswer === '') {
            setLoading(false)
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'Completa todos los campos antes de enviar el formulario.', life: 3000 });

            return;
        }
        if (credentials.password.value !== credentials.repeatPassword.value) {
            setLoading(false)
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden, favor de intentar de nuevo.', life: 3000 });
            return;
        }
        if ((currentDate - selectedDate) / (365.24 * 24 * 60 * 60 * 1000) < 18) {
            setLoading(false)
            /* alert('Eres menor de edad. No puedes registrarte') */
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Eres menor de edad. No puedes registrarte!', life: 4000 });
            return;
        }
        if (!isChecked) {
            setLoading(false)
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'Debes aceptar los términos y condiciones para registrarte.', life: 3000 });
            return;
        }
        const userInfo = {
            user: {
                id_role: 1,
                id_frequency: 1,
                name: nombre,
                last_name1: ApPaterno,
                last_name2: ApMaterno,
                email: credentials.email.value,
                password: credentials.password.value,
                phone: telefono,
                birthday: formData,
                question: selectedQuestion.value,
                answers: customAnswer,

            }
        }

        axios.post(`${URLConnection}/users/`, userInfo)
            .then(response => {
                if (response.data.success) {
                    setTimeout(() => {
                        setLoading(false)
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registro exitoso!', life: 3000 });
                        navigation('/login');
                    }, 3500)

                } else {
                    setLoading(false)
                    const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Registro fallido. ' + errorMessage, life: 3000 });
                }
            })
            .catch(error => {
                setLoading(false)
                if (error.response) {
                    // El servidor respondió con un error
                    if (error.response.status === 400) {
                        // Error específico de registro existente
                        toast.current.show({ severity: 'error', summary: 'Registro fallido', detail: 'El correo ya está registrado ', life: 3000 });
                    } else {
                        // Otro tipo de error del servidor
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error del servidor!', life: 3000 });
                    }
                } else if (error.message.toLowerCase() === 'network error') {
                    // Error de red, no hay conexión al servidor
                    console.warn(error.message);
                    toast.warn('Error de red. Por favor, verifica tu conexión a Internet.');
                } else {
                    // Otro tipo de error que no es del servidor (puede ser local)
                    console.log('Error:', error.message);
                    toast.error('Error inesperado. Por favor, inténtalo de nuevo más tarde.');
                    navigation('/Error-500');
                }
            })
    }

    return (
        <div className='mx-auto w-full max-w-3xl space-y-6 bg-white shadow-lg border-2 rounded-lg p-5'>
            <Toast ref={toast} />
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl sm:text-4xl font-bold text-purple-700'>Crear una cuenta</h1>
                <p className='text-gray-500'>Ingresa tus datos para registrarte</p>
            </div>
            <form>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="name">
                                Nombre
                            </label>
                            <input
                                id="name"
                                name='nombre'
                                value={nombre}
                                onChange={(e) => handleChange(e, setNombre)}
                                type="text"
                                placeholder='Ingresa tu nombre'
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {error && <p className='text-red-700'>{error}</p>}
                        </div>
                        <div>
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="first-surname">
                                Apellido Paterno
                            </label>
                            <input
                                id="aPaterno"
                                name='aPaterno'
                                type="text"
                                value={ApPaterno}
                                onChange={(e) => handleChange(e, setApPaterno)}
                                placeholder='Ingresa tu Apellido Paterno'
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="last-surname">
                                Apellido Materno
                            </label>
                            <input
                                id="last-surname"
                                type="text"
                                placeholder='Ingresa tu Apellido Materno'
                                required
                                value={ApMaterno}
                                onChange={(e) => handleChange(e, setApMaterno)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="date">
                                Fecha de Nacimiento
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={formData}
                                onChange={(e) => setFormData(e.target.value)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="phone">
                                Teléfono
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder='1234567890'
                                required
                                value={telefono}
                                onChange={validationPhone}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="example@example.com"
                                aria-errormessage='emailErrorID'
                                value={credentials.email.value}
                                onChange={validationPassword}
                                required
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${credentials.email.hasError ? 'border-red-500' : ''}`}
                            />
                            {credentials.email.hasError && (
                                <p id='emailErrorID' className='text-red-700'>
                                    Ingresa un Correo Válido
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="**********"
                                value={credentials.password.value}
                                onChange={validationPassword}
                                onBlur={handleBlur}
                                required
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${credentials.password.hasError ? "border-red-500" : ""}`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa fa-eye'}`}></i>

                            </button>
                            <PasswordStrengthBar password={credentials.password.value} />
                            {credentials.password.hasError && (
                                <div className="text-red-700">
                                    La contraseña debe tener al menos {minPassword} caracteres.
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="repeat-password">
                                Repetir Contraseña
                            </label>
                            <input
                                id="repeat-password"
                                name="repeatPassword"
                                type={showPasswordR ? "text" : "password"}
                                placeholder="**********"
                                value={credentials.repeatPassword.value}
                                onChange={validationPassword}
                                onBlur={handleBlur}
                                required
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${credentials.repeatPassword.hasError ? "border-red-500" : ""}`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={() => setShowPasswordR(!showPasswordR)}
                            >
                                <i className={`fa ${showPasswordR ? 'fa-eye-slash' : 'fa fa-eye'}`}></i>

                            </button>
                            {credentials.password.value !== credentials.repeatPassword.value && (
                                <div className="text-red-700">
                                    Las contraseñas no coinciden
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="secret-question">
                                Pregunta Secreta
                            </label>
                            <select
                                id="secret-question"
                                name="secret"
                                value={selectedQuestion ? selectedQuestion.id : 'default'}
                                onChange={handleQuestionChange}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option key='default'>
                                    Elige una Pregunta
                                </option>
                                {question.map((q) => (
                                    <option key={q.id} value={q.id}>
                                        {q.value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-md text-purple-600 font-semibold leading-none" htmlFor="secret-answer">
                                Respuesta
                            </label>
                            <input
                                id="secret-answer"
                                type="text"
                                placeholder="Ingresa tu respuesta"
                                value={customAnswer}
                                onChange={(e) => setCustomAnswer(e.target.value)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center  mt-4 space-x-2">
                    <input
                        type='checkbox'
                        id='termsCheckbox'
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}

                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                        className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-md"
                        htmlFor="terms"
                    >
                        Acepto los términos y condiciones
                    </label>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => navigation('/Login')}
                    >
                        Salir
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner animate-spin"></i> Registrando...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-user-plus mr-2"></i> Registrarse
                            </>
                        )}
                    </button>

                </div>
            </form>
        </div>
    );

}

export default Register;

{/* <div className='wrapper d-flex align-items-center justify-content-center'>
<div className='record rounded'>
    <h2 className='mb-2 text-center fw-bold fs-12'>Crear una Cuenta</h2>
    <form className='needs-validation'>
        <div className='row'>
            <div className='col-md-6 pt-3 p-2'>

                <div className='form-group mb-2'>
                    <label htmlFor='nombre' className='form-label fw-bold'>Nombre :</label>
                    <input className='form-control' id='nombre' type='text' name='nombre' value={nombre} onChange={(e) => handleChange(e, setNombre)} required />
                    {error && <p className='text-danger'>{error}</p>}
                </div>
                <div className='form-group mb-2'>
                    <label htmlFor='ApPaterno' className='form-label fw-bold'>Apellido Paterno :</label>
                    <input className='form-control' id='ApPaterno' type='text' name='ApPaterno' value={ApPaterno} onChange={(e) => handleChange(e, setApPaterno)} required />
                </div>
                <div className='form-group mb-2'>
                    <label htmlFor='ApMaterno' className='form-label fw-bold'>Apellido Materno :</label>
                    <input className='form-control' id='ApMaterno' type='text' name='ApMaterno' value={ApMaterno} onChange={(e) => handleChange(e, setApMaterno)} required />
                </div>
                <div className='form-group mb-2'>
                    <label htmlFor='telefono' className='form-label fw-bold'>Telefono :</label>
                    <input className='form-control' id='telefono' type='text' name='telefono' value={telefono} onChange={validationPhone} required />
                </div>
                <div className='form-group mb-2'>
                    <label htmlFor='email' className='form-label fw-bold'>Correo :</label>
                    <input className={`form-control ${credentials.email.hasError ? 'is-invalid' : ''}`} id='email' type='email' name='email' value={credentials.email.value} onChange={validationPassword} onBlur={handleBlur}
                        aria-errormessage='emailErrorID'
                        aria-invalid={credentials.email.hasError}
                        required
                    />
                    <p
                        id='msgID'
                        aria-live='assertive'
                        className='invalid-feedback'
                        style={{ visibility: credentials.email.hasError ? 'visible' : 'hidden' }}
                    >
                        Ingresa un Correo Válido
                    </p>
                </div>
            </div>
            <div className='col-md-6 pt-3 p-2'>
                <div className='form-group mb-2'>
                    <label htmlFor='fechaNac' className='form-label fw-bold'>Fecha de Nacimiento :</label>
                    <input
                        className='form-control'
                        id='fechaNac'
                        type='date'
                        name='fechaNac'
                        value={formData}
                        onChange={(e) => setFormData(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group mb-2'>
                    <label htmlFor='password' className='form-label fw-bold'>
                        Contraseña :
                    </label>
                    <div className='input-group'>
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
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            value={credentials.password.value}
                            onChange={validationPassword}
                            onBlur={handleBlur}
                            required
                        />
                        <div className="input-group-append">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    {credentials.password.hasError && (
                        <div className='invalid-feedback'>
                            La contraseña debe tener al menos {minPassword} caracteres.
                        </div>
                    )}
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
                    <div className='input-group'>
                        <input
                            className={`form-control was-validated ${credentials.repeatPassword.hasError ? 'is-invalid' : ''}`}
                            id='repeatPassword'
                            type={showPasswordR ? 'text' : 'password'}
                            name='repeatPassword'
                            value={credentials.repeatPassword.value}
                            onChange={validationPassword}
                            onBlur={handleBlur}
                            required
                        />
                        <div className="input-group-append">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPasswordR(!showPasswordR)}
                            >
                                <i className={`fa ${showPasswordR ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    {credentials.password.value !== credentials.repeatPassword.value && (
                        <div className='invalid-feedback'>
                            Las contraseñas no coinciden
                        </div>
                    )}
                </div>
                <div className='form-group mb-2'>
                    <label htmlFor='secret' className='form-label fw-bold'>
                        Pregunta secreta:
                    </label>
                    <div className='input-group'>
                        <select
                            name='secret'
                            id='secret'
                            className='form-control text-center'
                            onChange={handleQuestionChange}
                            value={selectedQuestion ? selectedQuestion.id : 'default'}
                            required
                        >
                            <option key='default' >
                                Elige una Pregunta
                            </option>
                            {question.map((q) => (
                                <option key={q.id} value={q.id}>
                                    {q.value}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedQuestion && (
                        <div className='input-field pt-4'>
                            <input
                                type='text'
                                className='form-control mt-2'
                                value={customAnswer}
                                onChange={(e) => setCustomAnswer(e.target.value)}
                                placeholder='Ingresa tu respuesta'
                                required
                            />
                        </div>
                    )}
                </div>
                <div className='form-group mb-3 mt-5'>
                    <div className='form-group'>
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                className='form-check-input'
                                id='termsCheckbox'
                                checked={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                            />
                            <label className='form-check-label' htmlFor='termsCheckbox'>
                                He leído y acepto los <a href='/Politicas/Terminos y Condiciones'>Términos y Condiciones</a> y las Políticas de Privacidad
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='row'>
            <div className='col-12 text-center mt-2'>
                <div className='row justify-content-center'>
                    <div className='col-12 col-sm-8 col-md-6 col-lg-4'>
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            className={`btn btn-primary w-100 ${loading ? 'loading' : ''}`}
                            disabled={loading}
                            style={{ position: 'relative', overflow: 'hidden' }}
                        >
                            {loading ? (
                                <div className="progress-container">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}>
                                        <i className="fa-solid fa-lock"></i>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <i className="fa-solid fa-lock-open me-2"></i>
                                    Crear Cuenta
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </form>
</div>
</div> */}