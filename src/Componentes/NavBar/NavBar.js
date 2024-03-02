import { MenuItems } from './MenuItems.js';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import '../../CSS/NavBar.css'
import { Link } from 'react-router-dom';
import { FormControl } from 'react-bootstrap';
import SessionStorage from '../sessionStorage.js';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


const NavBar = ({ onSearch }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(SessionStorage.hasSession());

    const hadleSearch = (e) => {
        const term = e.target.value;
        onSearch(term);
    };
    
    const logoutUser = () => {
        SessionStorage.clearSession();
        setIsLoggedIn(false);
        toast.success('Sesión cerrada correctamente!')
        setTimeout(()=>{
            window.location.reload()
        },2000)
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
                        <FormControl
                            type='text'
                            placeholder='Buscar...'
                            className='mr-sm-5 search-input w-50'
                            onChange={hadleSearch}
                        />
                        <Nav className=' nav-menu active'>
                            {MenuItems.map((item, index) => {
                                if (isLoggedIn && item.title === 'Login') {
                                    return (
                                        <Link  className='links nav-links' onClick={logoutUser}>Cerrar Sesión</Link>
                                    );
                                } else if (!isLoggedIn && item.title === 'Login') {
                                    return (
                                        <Link to={item.url} className='links nav-links' >{item.title}</Link>
                                    );
                                } else {
                                    return (
                                        <Link to={item.url} className='links nav-links' >{item.title}</Link>
                                    );
                                }
                            })}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </div>
    )
}

export default NavBar;