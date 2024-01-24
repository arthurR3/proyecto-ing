import React, { useState } from 'react'
import '../../CSS/NavBar.css';
import '../../CSS/Login.css';
/* import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup" */
/* import { useForm } from 'react-hook-form'; */

const emailRegexp = new RegExp(/[^@\t\r\n]+@[^@\t\r\n]+\.[^@\t\r\n]+/);
/* const validationSchema = yup
.object()
.shape({
    nombre : yup.string().required('Requerido'),
    ApPaterno : yup.string().required('Requerido'),
    ApMaterno : yup.string().required('Requerido'),
    email: yup.string().email('No es correo valido').required('Correo requerido'),
    password: yup.string().required('Contraseña requerida'),
    repeatPassword : yup.string().required('Escribe la contraseña de nuevo'),
})
.required(); */

const Register = () => {

     /* const {register, handleSubmit, formState, reset} = useForm({
         resolver: yupResolver(validationSchema),
         mode: 'onChange',
     });
     const {error, isValid} = formState;
 
     const onSubmit = (data) =>{
         console.log(data);
         reset();
     } */
 
    const [nombre, setNombre] = useState('');
    const [ApPaterno, setApPaterno] = useState('')
    const [ApMaterno, setApMaterno] = useState('')
    const [telefono, setTelefono] = useState('')
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [customAnswer, setCustomAnswer] = useState('');
    const [question] = useState([
        { id: 'color-favorite', value: '¿Cuál es tu color favorito?' },
        { id: 'movie-favorite', value: '¿Cuál es tu pelicula favorita?' },
        { id: 'peet-favorite', value: '¿Nombre de tu mascota?' },

    ])

    const handleQuestionChange = (e) => {
        const selectedQuestionId = e.target.value;

        // Si el usuario elige una pregunta, actualiza el estado
        if (selectedQuestionId !== 'default') {
            const selectedQuestion = question.find((q) => q.id === selectedQuestionId);
            setSelectedQuestion(selectedQuestion);
            setCustomAnswer('');
        } else {
            // Si selecciona "Elige una Pregunta", restablece el estado
            setSelectedQuestion(null);
            setCustomAnswer('');
        }
    };
    const handleCustomAnswerChange = (e) => {
        setCustomAnswer(e.target.value);
    };

    const minPassword = 8;

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

    const handleChange = (e, setterFunction) => {
        // Elimina espacios en blanco antes y al final
        const value = e.target.value.trim();

        // Validación solo letras y mensaje mínimo de 3 letras
        if (/^[a-zA-Z\s']*$/.test(value)) {

            setterFunction(value);

        } else if (value.length < 2) {
            console.log('Mínimo 3 letras');
            // Puedes mostrar un mensaje o realizar alguna acción cuando el valor es menor a 3 letras
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

        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: {
                value,
                hasError: name === 'password' && value.length < minPassword,
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
        if (!nombre || !ApPaterno || !ApMaterno || !telefono || !credentials.email.value || !credentials.password.value || !credentials.repeatPassword.value || !question) {
            alert('Por favor, completa todos los campos antes de enviar el formulario.');
            return;
        }
        // Realizar acciones adicionales al enviar el formulario


    };

    return (
        <div className='wrapper d-flex align-items-center justify-content-center'>
            <div className='record rounded align-text-center row'>
                <h2 className='mb-2 text-center fw-bold fs-12'>Crear una Cuenta</h2>
                <div className='col-6 pt-3 p-2 mr-5'>
                    <form className='needs-validation'>
                        {/* Contenido de la primera columna */}
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

                    </form>
                </div>
                <div className='col-6 pt-3 ml-5'>
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
                            <div className='input-field'>
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
        </div>
    );
}

export default Register;