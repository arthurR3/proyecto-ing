import React, { useRef, useState } from 'react'
import { AdminMenuItems, AdminMenuItemsPrivate } from './MenuItems';
import { useAdminAuth } from '../Context/AdminAuthContext';
import { Link } from 'react-router-dom';

const NavBarAdmin = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const sidebarRef = useRef(null);
    const dropdownRef = useRef(null);
    const { token, adminLogout } = useAdminAuth()

    const logoutUser = () => {
        adminLogout();
        window.location.reload();
    };

    return (
        <nav className='fixed top-0 w-full custom-gradient shadow-md py-3 px-6 z-50'>
            <div className='container mx-auto'>
                <div className='flex flex-wrap items-center justify-between'>
                    <div className={`w-full md:w-auto text-center mb-4 md:mb-0`}>
                        <Link className='inline-flex items-center text-white' to='/'>
                            <img
                                src='https://res.cloudinary.com/dnm7asoe3/image/upload/v1722473489/Image_Estetica/Estetica_Principal_BINA3_iejitd.png'
                                className='w-20 h-20'
                                alt='Logo Estetica'
                            />
                            <span className='text-xl font-bold'>Estética Principal</span>
                        </Link>
                    </div>

                    <div className='hidden md:flex items-center space-x-6'>
                
                        <div className='relative' ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className='flex items-center text-white focus:outline-none'
                            >
                                <img
                                    src={'https://res.cloudinary.com/dnm7asoe3/image/upload/v1722473489/Image_Estetica/Estetica_Principal_BINA3_iejitd.png'}
                                    alt='Avatar'
                                    className='w-8 h-8 rounded-full'
                                />
                                <span className='ml-2'>{"customer.name last_name1"}</span>
                            </button>
                            {isDropdownOpen && (
                                <ul className='absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20'>
                                    <li className='block px-4 py-2 text-gray-800 hover:bg-yellow-500 hover:text-white'>
                                        <Link to='/mi-perfil'>Mi Perfil</Link>
                                    </li>
                                    <li className='block px-4 py-2 text-gray-800 hover:bg-yellow-500 hover:text-white'>
                                        <Link to='/configuracion'>Configuración</Link>
                                    </li>
                                    <li className='block px-4 py-2 text-gray-800 hover:bg-yellow-500 hover:text-white'>
                                        <Link to='/shop-cart/details'>Mis Compras</Link>
                                    </li>
                                    <li className='block px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white'>
                                        <button onClick={logoutUser}>Cerrar Sesión</button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBarAdmin