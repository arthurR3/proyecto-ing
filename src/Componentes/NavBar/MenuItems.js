import { Link } from "react-router-dom";
import '../../CSS/NavBar.css'

export const MenuItems = [
    {
        title: 'Inicio',    
        url: '/',
        cName: 'nav-links'
    },
    {
        title: 'Productos',
        url: '/productos',
        cName: 'nav-links'
    },
    {
        title: 'Servicios',
        url: '/Servicios',
        cName: 'nav-links'
    },
    {
        title: 'Citas',
        url: '/agendamiento-cita',
        cName: 'nav-links'
    },
    {
        title: 'Contacto',
        url: '/contacto',
        cName: 'nav-links'
    },
    {
        title: 'Login',
        url: '/Login',
        cName: 'nav-links'
    },
];

export const MenuItemsPrivate = [
    {
        title: 'Inicio',    
        url: '/',
        cName: 'nav-links'
    },
    {
        title: 'Productos',
        url: '/productos',
        cName: 'nav-links'
    },
    {
        title: 'Servicios',
        url: '/Servicios',
        cName: 'nav-links'
    },
    {
        title: 'Mis Citas',
        url: '/agendamiento-cita',
        cName: 'nav-links'
    },
    {
        title: 'Mis Compras',
        url: '/mis-compras',
        cName: 'nav-links'
    },
    {
        title: 'Cerrar Sesion',
        url: '/',
        cName: 'nav-links',
    },
];


export function CitaBtn() {
    return (
        <div>
            <Link to='/agendamiento-cita' className="text-decoration-none"> 
                <button className="calendr-btn">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Agendar Cita
                </button>
            </Link>
        </div>
    )
}



