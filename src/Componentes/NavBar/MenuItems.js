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
        url: '/servicios',
        cName: 'nav-links'
    },
    {
        title: 'Agendar Cita',
        url: '/servicios',
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
        url: '/servicios',
        cName: 'nav-links'
    },
    {
        title: 'Agendar Cita',
        url: '/book-appointments',
        cName: 'nav-links'
    },
    {
        title: 'Mis Compras',
        url: '/shop-cart/details',
        cName: 'nav-links'
    },
    {
        icons: <i class="fa-solid fa-cart-arrow-down"></i>,
        url: '/shop-cart',
        cName: 'nav-links'
    },
    {
        icons: <i class="fa-solid fa-user-gear"></i>,
        url: '/User-info/',
        cName: 'nav-links'
    },
    {
        title: 'Cerrar Sesión',
        cName: 'nav-links'
    },
];

export const AdminMenuItems = [
    {
        title: 'Dashboard',
        url: '/admin',
        icons: <i className="fa-solid fa-tachometer-alt"></i>,
    },
    {
        title: 'Productos',
        url: '/admin/Productos-list',
        icons: <i className="fa-solid fa-box"></i>,
    },
    {
        title: 'Clientes',
        url: '/admin/clientes',
        icons: <i className="fa-light fa-users"></i>,
    },
    {
        title: 'Citas',
        url: '/admin/citas-list',
        icons: <i className="fa-solid fa-calendar-check"></i>,
    },
];

export const AdminMenuItemsPrivate = [
    ...AdminMenuItems,
    {
      title: 'Cerrar Sesión',
      url: '/',
      icons: <i className="fa-solid fa-right-from-bracket"></i>,
    },
  ]

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



