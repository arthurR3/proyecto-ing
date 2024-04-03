import { MenuItems, MenuItemsPrivate } from './MenuItems.js';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import '../../CSS/NavBar.css'
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
        toast.success('Sesión cerrada correctamente!')
    }
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
                        {/* <FormControl
                            type='text'
                            placeholder='Buscar...'
                            className='mr-sm-4 search-input w-50'
                            onChange={hadleSearch}
                        /> */}
                        <Nav className=' nav-menu active'>
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
                                                    <i class="fa-solid fa-person-walking-dashed-line-arrow-right"></i>
                                                ) : (
                                                    <i class="fa-solid fa-right-from-bracket"></i>
                                                )}
                                            </Link>
                                        );
                                    } else {
                                        return (
                                            <Link to={item.url} className='links nav-links' >{item.icons}{item.title}</Link>
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
    )
}

export default NavBar;