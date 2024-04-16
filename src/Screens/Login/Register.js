import React, { useState } from 'react'
import '../../CSS/NavBar.css';
import '../../CSS/Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import codigosPostal from '../../Componentes/Api/apiCodigoP';
import PasswordStrengthBar from 'react-password-strength-bar';
import ApiConnection from '../../Componentes/Api/ApiConfig';


const emailRegexp = new RegExp(/[^@\t\r\n]+@[^@\t\r\n]+\.[^@\t\r\n]+/);
const minPassword = 8;

const Register = () => {
    const URLConnection = ApiConnection();
    const navigation = useNavigate();
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('')
    const [ApPaterno, setApPaterno] = useState('')
    const [ApMaterno, setApMaterno] = useState('')
    const [telefono, setTelefono] = useState('')
    const [codigoPostal, setCodigoPostal] = useState('')
    const [municipio, setMunicipio] = useState('')
    const [selectedColonia, setSelectedColonia] = useState('');
    const [colonia, setColonia] = useState([])
    const [calle, setCalle] = useState('')
    const [formData, setFormData] = useState('')
    const [state, setState] = useState({
        paso: 1
    })
    const [showPassword, setShowPassword] = useState('')
    const [showPasswordR, setShowPasswordR] = useState('')
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [customAnswer, setCustomAnswer] = useState('');
    const [question] = useState([
        { id: 'color-favorite', value: '¿Cuál es tu color favorito?' },
        { id: 'movie-favorite', value: '¿Cuál es tu pelicula favorita?' },
        { id: 'peet-favorite', value: '¿Nombre de tu mascota?' },

    ])
    console.log(selectedColonia)
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (!error.response) {
                throw new Error('Network Error. Please check your internet connection.');
            }
            return Promise.reject(error);
        }
    );
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

    const handleCustomAnswerChange = (e) => {
        setCustomAnswer(e.target.value);
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

    // Función que maneja el cambio del código postal
    const handleCodigoP = async (e) => {
        const codePostal = e.target.value;
        //console.log('Código Postal:', codePostal);

        if (codePostal.length === 5) {
            try {
                const response = await codigosPostal(codePostal);
                //console.log(response)
                if (response && response.length > 0) {
                    const firstEntry = response[0]; // Tomar el primer elemento de la respuesta
                    setMunicipio(firstEntry.municipio.nombre);
                    const colonias = response.map((entry) => entry.colonia);
                    setColonia(colonias);
                } else {
                    toast.error('Código postal no válido. Verifica e intenta de nuevo.');
                }
            } catch (error) {
                console.error('Error al obtener información del código postal', error);
                toast.error('Error al obtener información del código postal. Inténtalo de nuevo.');
            }
        } else {
            setMunicipio('');
            setColonia([]);
            setSelectedColonia(''); // Limpiar la colonia seleccionada

        }

        // Actualizar el estado del código postal
        setCodigoPostal(codePostal);
    };

    // ...

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
        const currentDate = new Date();
        const selectedDate = new Date(formData);

        if (!nombre || !ApPaterno || !ApMaterno || !telefono || !credentials.email.value || !credentials.password.value || !credentials.repeatPassword.value || !question) {
            toast.info('1 Por favor, completa todos los campos antes de enviar el formulario.');
            return;
        }
        if (credentials.email.value === '' || credentials.password.value === '' || credentials.repeatPassword.value === '' || customAnswer === '') {
            toast('Completa los campos para poder realizar tu registro', {
                position: 'bottom-center'
            })
            return;
        }
        if (credentials.password.value !== credentials.repeatPassword.value) {
            toast.error('Las contraseñas no coinciden, favor de intentar de nuevo', {
                position: 'bottom-center'
            })
            return;
        }
        if ((currentDate - selectedDate) / (365.24 * 24 * 60 * 60 * 1000) < 18) {
            /* alert('Eres menor de edad. No puedes registrarte') */
            toast.error('Eres menor de edad. No puedes registrarte!', {
                position: "top-center",
                className: 'foo-bar mt-5'
            })
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
                
            },
            address: {
                municipality: municipio,
                cologne: selectedColonia,
                street: calle,
                cp: codigoPostal
            },
        }

        axios.post(`${URLConnection}/users/`, userInfo)
            .then(response => {
                console.log("Response:", response.data);
                if (response.data.success) {
                    toast.success("Registro exitoso", {
                        position: 'top-right',
                        className: 'mt-5'
                    });
                    navigation('/login');
                } else {
                    const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                    alert('Registro fallido. ' + errorMessage);
                }
            })
            .catch(error => {
                if (error.response) {
                    // El servidor respondió con un error
                    if (error.response.status === 400) {
                        // Error específico de registro existente
                        toast.error('El correo ya está registrado. Favor de utilizar otro correo.');
                    } else {
                        // Otro tipo de error del servidor
                        toast.error('Error del servidor: ' + error.response.data.message);
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
        /* console.log(userInfo) */

    }

    const handleSiguiente = (e) => {
        e.preventDefault();

        if (!nombre || !ApPaterno || !ApMaterno || !telefono || !colonia || !municipio || !calle || !codigoPostal) {
            toast.error('Por favor, completa todos los campos antes de enviar el formulario.');
            return;
        }
        else {
            setState((prevState) => ({
                ...prevState,
                paso: prevState.paso + 1,
            }));

        }

    }

    return (
        <div className='wrapper d-flex align-items-center justify-content-center'>
            <div className='record rounded align-text-center row'>
                {state.paso === 2 && (
                    <div className='col-12 text-left mt-2'>
                        <i className='fa-solid fa-arrow-left'></i>
                        <span onClick={() => setState((prevState) => ({ ...prevState, paso: prevState.paso - 1 }))} className=' btn btn-link text-decoration-none text-reset back-link hover'>
                            Regresar
                        </span>
                    </div>)}
                <h2 className='mb-2 text-center fw-bold fs-12'>Crear una Cuenta</h2>

                <form className='needs-validation'>
                    {state.paso === 1 && (

                        < div className='row'>
                            <div className='col-6 pt-3 p-2 mr-5'>

                                <div className='form-group mb-2'>
                                    <label htmlFor='nombre' className='form-label fw-bold'>Nombre :</label>
                                    <input
                                        className='form-control'
                                        id='nombre'
                                        type='text'
                                        name='nombre'
                                        value={nombre}
                                        onChange={(e) => handleChange(e, setNombre)}
                                        required
                                    />
                                    {error && <p className='text-danger'>{error}</p>}
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor='ApPaterno' className='form-label fw-bold'>Apellido Paterno :</label>
                                    <input
                                        className='form-control'
                                        id='ApPaterno'
                                        type='text'
                                        name='ApPaterno'
                                        value={ApPaterno}
                                        onChange={(e) => handleChange(e, setApPaterno)}
                                        required
                                    />
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor='ApMaterno' className='form-label fw-bold'>Apellido Materno :</label>
                                    <input
                                        className='form-control'
                                        id='ApMaterno'
                                        type='text'
                                        name='ApMaterno'
                                        value={ApMaterno}
                                        onChange={(e) => handleChange(e, setApMaterno)}
                                        required
                                    />
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor='telefono' className='form-label fw-bold'>Telefono :</label>
                                    <input
                                        className='form-control'
                                        id='telefono'
                                        type='text'
                                        name='telefono'
                                        value={telefono}
                                        onChange={validationPhone}
                                        required
                                    />
                                </div>

                            </div>
                            <div className='col-6 pt-3 ml-5'>
                                <div className='form-group mb-2'>
                                    <label htmlFor='codigoPostal' className='form-label fw-bold'>Codigo Postal :</label>
                                    <input
                                        className='form-control'
                                        id='codigoPostal'
                                        type='text'
                                        name='codigoPostal'
                                        value={codigoPostal}
                                        onChange={(e) => handleCodigoP(e)}
                                    />
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor='municipio' className='form-label fw-bold'>Municipio :</label>
                                    <input
                                        className='form-control'
                                        id='municipio'
                                        type='text'
                                        name='municipio'
                                        value={municipio}
                                        disabled={municipio.length === 0}
                                        readOnly
                                    />
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor='colonia' className='form-label fw-bold'>Colonia :</label>
                                    <select
                                        className='form-control'
                                        id='colonia'
                                        name='colonia'
                                        value={selectedColonia}
                                        onChange={(e) => setSelectedColonia(e.target.value)}
                                        disabled={colonia.length === 0}
                                    >

                                        {colonia.length === 0 && (
                                            <option value={''}>Selecciona una colonia</option>
                                        )}
                                        {colonia.map((coloniaOption, index) => (
                                            <option key={index} value={coloniaOption}>
                                                {coloniaOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='form-group mb-2'>
                                    <label htmlFor='calle' className='form-label fw-bold'>Calle :</label>
                                    <input
                                        className='form-control'
                                        id='calle'
                                        type='text'
                                        name='calle'
                                        value={calle}
                                        onChange={(e) => setCalle(e.target.value)}
                                    />
                                </div>
                                {/* {state.errores.calle && (
                                    <p className='small text-danger'>{state.errores.calle}</p>
                                )} */}
                                <div className='d-flex justify-content-center mt-2'>
                                    <button type='submit' onClick={handleSiguiente} className='btn btn-success me-2 fs-5'>
                                        Siguiente
                                    </button>
                                    <Link to="/login" className='btn btn-secondary me-2 fs-5'>
                                        Cancelar
                                    </Link>
                                </div>

                            </div>
                        </div>
                    )}
                    {state.paso === 2 && (

                        <div className='row'>
                            <div className='col-6 pt-3 ml-5'>
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
                                    <label htmlFor='email' className='form-label fw-bold'>Correo :</label>
                                    <input
                                        className={`form-control ${credentials.email.hasError ? 'is-invalid' : ''}`}
                                        id='email'
                                        type='email'
                                        name='email'
                                        value={credentials.email.value}
                                        onChange={validationPassword}
                                        onBlur={handleBlur}
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
                            </div>
                            <div className='col-6 pt-3 ml-5'>
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
                                                onChange={handleCustomAnswerChange}
                                                placeholder='Ingresa tu respuesta'
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='col-12 text-center mt-2'>
                                {/* Fila adicional para centrar el botón */}
                                <div className='row justify-content-center'>
                                    <div className='col-6'>
                                        <button type='submit' onClick={handleSubmit} className='btn btn-success align-items-center mt-2 fs-5'>
                                            Registrarme
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </form>
            </div >
        </div >
    );
}

export default Register;