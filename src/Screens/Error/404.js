import React from 'react'
import '../../CSS/NavBar.css'
import '../../CSS/Login.css'
import imgError from '../../Image/error404.png';

function Error404() {
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

export default Error404