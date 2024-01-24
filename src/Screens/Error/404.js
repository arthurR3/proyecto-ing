import React from 'react'
import '../../CSS/NavBar.css'
import '../../CSS/Login.css'

function Error404() {
    return (
        <div className="home-page">
        <header className="h-100 min-vh-100 d-flex align-items-center text-light mt-5 shadow">
            <div className="container m-50">
                        <h2 className="mb-3 text-black fs-20">Surgio algun inprevisto!</h2>
                        <h4 className="mb-5 text-black fs-10">Regresa a la pagina anterior...</h4>
                    </div>
        </header>
    </div>
    )
}

export default Error404