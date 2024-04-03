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
        title: 'Agendar Cita',
        url: '/book-appointments',
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
        url: '/',
        cName: 'nav-links',
        icons: <i class="fa-solid fa-house-laptop"></i>
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
        url: '/book-appointments',
        cName: 'nav-links'
    },
    /* {
        title: 'Mis Compras',
        url: '/mis-compras',
        cName: 'nav-links'
    }, */
    {
        icons: <i class="fa-solid fa-cart-arrow-down"></i>,
        url: '/shop-cart',
        cName: 'nav-links'
    },
    {
        title: 'Cerrar Sesión',
        cName: 'nav-links'
    },
    {
        icons:<i class="fa-solid fa-user-gear"></i>,
        cName: 'nav-links'
    },
];


export function CitaBtn() {
    return (
        <div>
            <Link to='/book-appointments' className="text-decoration-none"> 
                <button className="calendr-btn">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Agendar Cita
                </button>
            </Link>
        </div>
    )
}



