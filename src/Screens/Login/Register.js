import React, { useState } from 'react'
import '../../CSS/NavBar.css';
import '../../CSS/Login.css';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [ApPaterno, setApPaterno] = useState('')
    const [ApMaterno, setApMaterno] = useState('')

    const handleChange = (e, setterFunction) => {
        // Elimina espacios en blanco antes y al final
        const value = e.target.value.trim();
        //Validacion solo letras y minimo de 3 letras
        if (/^[a-zA-Z\s']*$/.test(value) < 3 || value === '' ? 'is-invalid': '') {
            setterFunction(value);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Realizar acciones adicionales al enviar el formulario
        console.log('Nombre:', nombre);
        console.log('Apellidos:', ApPaterno + ApMaterno);
      };

    return (
        <div className='wrapper d-flex align-items-center justify-content-center w-200 mt-5'>
            <div className='login rounded align-text-center'>
                <h2 className='mb-2 text-center fw-bold fs-12'>Crear una Cuenta</h2>
                <form className='needs-validation'>
                    <div className='form-group mb-2'>
                        <label htmlFor='nombre' className='form-label fw-bold'>Nombre :</label>
                        <input
                            className='form-control'
                            id='nombre'
                            type='text'
                            name='nombre'
                            value={nombre}
                            onChange={(e) => handleChange(e,setNombre)}
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
                            onChange={(e) => handleChange(e,setApPaterno)}
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='ApMaterno' className='form-label fw-bold'>Apellido Materno :</label>
                        <input
                            className='form-control'
                            id='ApMaterno'
                            type='ApMaterno'
                            name='ApMaterno'
                            value={ApMaterno}
                            onChange={(e) => handleChange(e,setApMaterno)}
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='telefono' className='form-label fw-bold'>Telefono :</label>
                        <input
                            className='form-control'
                            id='telefono'
                            type='telefono'
                            name='telefono'
                            value={''}
                            onChange={handleChange}
                        />
                    </div>
                    {/* <div className='form-group mb-2'>
                        <label htmlFor='email' className='form-label fw-bold'>Correo :</label>
                        <input
                            className={`form-control ${credentials.email.hasError ? 'is-invalid' : ''}`}
                            id='email'
                            type='email'
                            name='email'
                            value={credentials.email.value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-errormessage='emailErrorID'
                            aria-invalid={credentials.email.hasError}
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
                        <label htmlFor='password' className='form-label fw-bold'>Contraseña :</label>
                        <input
                            className={`form-control ${credentials.password.hasError ? 'is-invalid' : ''}`}
                            id='password'
                            type='password'
                            name='password'
                            value={credentials.password.value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {credentials.password.hasError && (
                            <div className='invalid-feedback'>
                                La contraseña debe tener al menos {minPassword} caracteres.
                            </div>
                        )}
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='password' className='form-label fw-bold'>Repetir Contraseña :</label>
                        <input
                            className={`form-control ${credentials.password.hasError ? 'is-invalid' : ''}`}
                            id='password'
                            type='password'
                            name='password'
                            value={credentials.password.value}
                            onChange={handleChange}
                        />
                        {credentials.password.hasError && (
                            <div className='invalid-feedback'>
                                La contraseña debe tener al menos {minPassword} caracteres.
                            </div>
                        )}
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='email' className='form-label fw-bold'>Pregunta Secreta :</label>
                        <input
                            className={`form-control`}
                            id='email'
                            type='email'
                            name='email'
                            value={credentials.email.value}
                            onChange={handleChange}
                        />
                    </div> */}
                    <div>
                        <button type='button ' className='btn btn-success align-items-center mt-2'>
                            Siguiente
                        </button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;