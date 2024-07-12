import React from 'react'
import { Link } from 'react-router-dom'
import '../CSS/NavBar.css'
function Footer() {
    
    return (
        <footer className='fondo text-dark pt-5 pb-4'>
            <div className='container h-100 text-center text-md-start'>
                <div className='row text-center text-md-start'>

                    <div className='col-md-3 col-lg-3 col-xl-3 mx-auto mt-3'>
                        <h5 className='text-uppercase mb-4 font-weight-bold text-warning'>Nosotros</h5>
                        <hr className='mb-4' />
                        <p  className='text-white'>Estetica Principal mas cerca de tí!</p>
                    </div>

                    <div className='col-md-2 col-lg-2 col-xl-2 mx-auto mt-3'>
                        <h5 className='text-uppercase mb-4 font-weight-bold text-warning'>Dejanos Ayudarte</h5>
                        <hr className='mb-4' />
                        <p>
                            <Link to='/register'  className='text-white'>Registrarme</Link>
                        </p>
                        <p>
                            <Link to='/Login'  className='text-white'>Ir a mi cuenta</Link>
                        </p>
                        <p>
                            <Link to='/register' className='text-white'>Contacto</Link>
                        </p>
                        <p>
                            <Link to='/register'  className='text-white'>Necesito Ayuda</Link>
                        </p>
                    </div>

                    <div className='col-md-2 col-lg-2 col-xl-2 mx-auto mt-3'>
                        <h5 className='text-uppercase mb-4 font-weight-bold text-warning'>Términos y Politicas</h5>
                        <hr className='mb-4' />
                        <p>
                            <Link to='/Politicas/Aviso de Privacidad' className='text-white'>Politicas de Privacidad</Link>
                        </p>
                        <p>
                            <Link to='/Politicas/Terminos y Condiciones'  className='text-white'>Términos y Condiciones</Link>
                        </p>
                        <p>
                            <Link to='/register'  className='text-white'>Politicas de cookies</Link>
                        </p>
                    </div>
                </div>
            </div>
            <p className='text-white'>©Camps 2023 && Estética Principal, Inc.</p>
        </footer>
    )
}

export default Footer