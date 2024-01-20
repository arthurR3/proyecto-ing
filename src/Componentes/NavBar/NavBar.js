import { MenuItems } from './MenuItems.js';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import '../../CSS/NavBar.css'
import { Link } from 'react-router-dom';


const NavBar = () => {
    return (
        <div>
            <Navbar expand='lg' className='NavbarItems fixed-top'>
                <Container>
                    <Navbar.Brand className=''>
                        <Link to="/" className='navbar-brand fw-semibold text-white navbar-logo '>
                            Estética Principal
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className=' nav-menu active'>
                            {MenuItems.map((item, index) => {
                                return (
                                    <Link to={item.url} className='links nav-links'>{item.title}</Link>
                                );
                            })}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </div>
    )
}

export default NavBar;