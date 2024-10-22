import { Link } from "react-router-dom";
import '../../css/NavBar.css'

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
        url: '/servicios-agendar',
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
        title: 'Inicio',
        cName: 'nav-links',
    },
    {
        title: 'Productos',
        url: '/productos',
        cName: 'nav-links',
    },
    {
        title: 'Agendar',
        url: '/servicios-agendar',
        cName: 'nav-links',
    },
    {
        title: 'Mis Citas',
        url: '/user-info/citas-agendadas',
        cName: 'nav-links'
    },
    /* {
        title: 'Productos Recomendados',
        cName: 'nav-links',
        url:'https://prediction-recomendaciones.onrender.com'
    }, */
    {
        icons: <i className="fa-solid fa-cart-arrow-down fa-lg"></i>,
        url: '/carrito-compras',
        cName: 'nav-links'
    },
];

export const AdminMenuItems = [
    {
        url: '/admin/home',
        icons: <i className="fa-solid fa-house-chimney-window"></i>
    },
    {
        title: 'Citas',
        url: '/admin/admin/citas-list',
        icons: <i className="fa-solid fa-calendar-check"></i>,
    },
    {
        title: 'Clientes',
        url: '/admin/admin/clientes',
        icons: <i className="fa-solid fa-users-line"></i>,
    },
    {
        title: 'Productos',
        url: '/admin/admin/Productos-list',
        icons: <i className="fa-solid fa-box"></i>,
    },
    {
        title: 'Servicios',
        url: '/admin/admin/services-list',
        icons: <i className="fa-solid fa-hands-helping"></i>,
    },
    {
        title: 'Ventas',
        url: '/admin/admin/ventas-realizadas',
        icons: <i className="fa-solid fa-sack-dollar"></i>,
    }
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
            <Link to='/servicios' className="text-decoration-none">
                <button className="calendr-btn">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Agendar Cita
                </button>
            </Link>
        </div>
    )
}



