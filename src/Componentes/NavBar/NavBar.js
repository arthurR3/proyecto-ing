import { MenuItems, MenuItemsPrivate, AdminMenuItems, AdminMenuItemsPrivate } from './MenuItems.js';
import '../../CSS/NavBar.css';
import { Link, useLocation } from 'react-router-dom';
import SessionStorage from '../sessionStorage.js';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../Context/AuthContext.js'
import { jwtDecode } from 'jwt-decode';
import { useAdminAuth } from '../Context/AdminAuthContext.js';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(SessionStorage.hasSession());
    const auth = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        setIsLoggedIn(SessionStorage.hasSession());
        if (isLoggedIn && auth && auth.token) {
            const data = jwtDecode(auth.token);
            setUserData((data.user.nombre).concat(' ') + data.user.lastName);
        }
    }, [isLoggedIn, auth]);

    const logoutUser = () => {
        SessionStorage.clearSession();
        setIsLoggedIn(false);
        window.location.reload();
        toast.success('Sesión cerrada correctamente!');
    };
    return (
        <nav className="NavbarItems fixed-top w-100 px-5">
            <div className="container">
                <div className="row mb-0 align-items-center">
                    <div className={`col-md-6 ${isLoggedIn ? 'text-start' : 'text-center'}`}>
                        <Link className="navbar-brand" to="/">
                            <img
                                src='https://res.cloudinary.com/dnm7asoe3/image/upload/v1722473489/Image_Estetica/Estetica_Principal_BINA3_iejitd.png'
                                className='rounded-circle me-2'
                                alt="Logo"
                                style={{ width: '60px', height: '60px' }}
                            />
                            Estética Principal
                        </Link>
                    </div>
                    {isLoggedIn && (
                        <div className="col-md-6 d-flex justify-content-end align-items-center">
                            <Link className='nav-link' to='/User-info/datosPersonal'>
                                <i className="fa-solid fa-user-gear fa-lg"></i>
                            </Link>
                            <span className="user-name ms-2">{userData}</span>
                        </div>
                    )}
                </div>
                <div className="row">
                    <div className="nav-menu">
                        <ul className="d-flex font-weight-bold justify-content-end">
                            {isLoggedIn ?

                                MenuItemsPrivate.map((item) => {
                                    if (item.title === 'Cerrar Sesión') {
                                        return (
                                            <div className="nav-item" key={item.title}>
                                                <button
                                                    className='btn btn-danger d-flex align-items-center gap-2'
                                                    onClick={logoutUser}
                                                >
                                                    <i className="fa-solid fa-right-from-bracket"></i>
                                                    {item.title}
                                                </button>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <li className="nav-item" key={item.title}>
                                                <Link to={item.url} className='nav-link'>{item.icons}{item.title}</Link>
                                            </li>
                                        );
                                    }
                                }) :
                                MenuItems.map((item) => (
                                    <li className="nav-item" key={item.title}>
                                        <Link to={item.url} className='nav-link'>{item.title}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavBarAdmin = () => {
    const {adminLogout, admin} = useAdminAuth()

    const logoutUser = () => {
      adminLogout()
        window.location.reload();
        toast.success('Sesión cerrada correctamente!');
    };
    
    return (
        <nav className="bg-light shadow NavbarItems fixed-top w-100 px-3 navbar-admin py-3">
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap">
                {/* Logo */}
                <Link className="navbar-brand" to="/">
                    <img src='https://res.cloudinary.com/dnm7asoe3/image/upload/v1722473489/Image_Estetica/Estetica_Principal_BINA3_iejitd.png' className='rounded-circle me-2' />
                </Link>
                <div className="nav-menu active order-3 w-100 md-w-auto order-md-2">
                    <ul className="d-flex font-weight-bold justify-content-end">
                        {admin &&
                            AdminMenuItemsPrivate.map((item) => {
                                if (admin && item.title === 'Cerrar Sesión') {
                                    return (
                                        <div className="nav-item" key={item.title}>
                                            <button
                                                className='btn btn-danger d-flex align-items-center gap-2'
                                                onClick={logoutUser}
                                            >
                                                <i className="fa-solid fa-right-from-bracket"></i>
                                                {item.title}
                                            </button>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <Link to={item.url} className='nav-link '>{item.icons}{item.title}</Link>
                                    );
                                }
                            })
                        }
                    </ul>
                </div>
                {/* <div className="order-2 order-md-3">
                    <button className="btn btn-primary d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Login</span>
                    </button>
                </div> */}
            </div>
        </nav>
    );
};

export { NavBar, NavBarAdmin };
