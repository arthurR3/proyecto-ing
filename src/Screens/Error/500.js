import React from 'react';
import imgError from '../../Image/error500.png';
import { Link } from 'react-router-dom';

function Error500() {
    return (
        <div className="home-page">
            <header className="min-vh-100 d-flex align-items-center justify-content-center text-light mt-5 shadow">
                <div className="">
                    <img src={imgError} alt="Mi imagen" style={{ width: '100%', height: '100%' }} />
                </div>
            </header>
            <Link to="/" className='btn btn-secondary'>
                Regresar al Inicio
            </Link>
        </div>
    )
}

export default Error500;
