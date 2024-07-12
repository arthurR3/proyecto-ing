import { MenuItems, MenuItemsPrivate, AdminMenuItems, AdminMenuItemsPrivate } from './MenuItems.js';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import '../../CSS/NavBar.css';
import { Link, useLocation } from 'react-router-dom';
import SessionStorage from '../sessionStorage.js';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Breadcrumb } from 'react-bootstrap';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(SessionStorage.hasSession());
    const [hovered, setHovered] = useState(false);
    const location = useLocation();
    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const routes = {
        '/': 'Inicio',
        '/productos': 'Productos',
        '/login': 'Login',
    };
    const pathnames = location.pathname.split('/').filter((x) => x);

    const logoutUser = () => {
        SessionStorage.clearSession();
        setIsLoggedIn(false);
        window.location.reload();
        toast.success('Sesión cerrada correctamente!');
    };

    useEffect(() => {
        setIsLoggedIn(SessionStorage.hasSession());
    }, []);

    return (
        <div>
            <Navbar expand='lg' className='NavbarItems fixed-top'>
                <Container>
                    <Navbar.Brand className=''>
                        <Link to="/" className='navbar-brand fw-semibold text-white navbar-logo ml-1'>
                            Estética Principal
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='nav-menu active'>
                            {isLoggedIn ?
                                MenuItemsPrivate.map((item) => {
                                    if (isLoggedIn && item.title === 'Cerrar Sesión') {
                                        return (
                                            <Link
                                                className='links nav-links'
                                                onClick={logoutUser}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {hovered ? (
                                                    <i className="fa-solid fa-person-walking-dashed-line-arrow-right"></i>
                                                ) : (
                                                    <i className="fa-solid fa-right-from-bracket"></i>
                                                )}
                                            </Link>
                                        );
                                    } else {
                                        return (
                                            <Link to={item.url} className='links nav-links'>{item.icons}{item.title}</Link>
                                        );
                                    }
                                }) :
                                MenuItems.map((item) => (
                                    <Link key={item.title} to={item.url} className='links nav-links'>{item.title}</Link>
                                ))
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Breadcrumb>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    return (
                        <Breadcrumb.Item key={routeTo} active={isLast}>
                            {isLast ? (
                                name
                            ) : (
                                <Link to={routeTo}>{name}</Link>
                            )}
                        </Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        </div>
    );
};

const NavBarAdmin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(SessionStorage.hasSession());
    const [hovered, setHovered] = useState(false);
    const location = useLocation();

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const logoutUser = () => {
        SessionStorage.clearSession();
        setIsLoggedIn(false);
        window.location.reload();
        toast.success('Sesión cerrada correctamente!');
    };

    useEffect(() => {
        setIsLoggedIn(SessionStorage.hasSession());
    }, []);

    return (
        <div>
            <Navbar expand='lg' className='NavbarItems fixed-top'>
                <Container>
                    <Navbar.Brand className=''>
                        <Link to="/admin" className='navbar-brand fw-semibold text-white navbar-logo ml-1'>
                            Admin Dashboard
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='nav-menu active'>
                            {isLoggedIn ?
                                AdminMenuItemsPrivate.map((item) => {
                                    if (isLoggedIn && item.title === 'Cerrar Sesión') {
                                        return (
                                            <Link
                                                key={item.title}
                                                className='links nav-links'
                                                onClick={logoutUser}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {hovered ? (
                                                    <i className="fa-solid fa-person-walking-dashed-line-arrow-right"></i>
                                                ) : (
                                                    <i className="fa-solid fa-right-from-bracket"></i>
                                                )}
                                            </Link>
                                        );
                                    } else {
                                        return (
                                            <Link key={item.title} to={item.url} className='links nav-links'>{item.icons}{item.title}</Link>
                                        );
                                    }
                                }) :
                                AdminMenuItems.map((item) => (
                                    <Link key={item.title} to={item.url} className='links nav-links'>{item.title}</Link>
                                ))
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
           {/*  <div className='d-flex home'>
                <div className='d-flex sidebar flex-column flex-shrink-0 text-white bg-dark'>
                    <ul className='nav nav-pills flex-column mb-auto px-0'>
                        <a href='#' className='nav-link'>Dashboard</a>
                    </ul>
                </div>
                <div className='content'>
                    Content
                </div>
            </div> */}
        </div>

    );
};

export { NavBar, NavBarAdmin };
