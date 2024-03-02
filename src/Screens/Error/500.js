import React from 'react'
import imgError from '../../Image/error500.png';

function Error500() {
    return (
        <div className="home-page">
            <header className="h-100 min-vh-100 d-flex align-items-center text-light mt-5 shadow">
                <div className="">
                    <img src={imgError} alt="Mi imagen" />
                </div>
            </header>
        </div>
    )
}

export default Error500