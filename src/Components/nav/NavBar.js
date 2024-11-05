import { MenuItems, MenuItemsPrivate, AdminMenuItemsPrivate } from './MenuItems.js';
import '../../css/NavBar.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../Context/AuthContext.js';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import ApiConnection from '../Api/ApiConfig.js';
const NavBar = () => {
  const URLConnetion = ApiConnection()
  const [customer, setCustomer] = useState(null);
  const { token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.user.idUser;
          const response = await axios.get(`${URLConnetion}/users/${userId}`);
          setCustomer(response.data);
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    fetchCustomer();
  }, [token]);

  const logoutUser = () => {
    logout();
    window.location.reload();
    toast.success('Sesión cerrada correctamente!');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className='fixed top-0 w-full custom-gradient shadow-md py-3 px-6 z-50'>
      <div className='container mx-auto'>
      <div className='custom-navbar'>
      {/* Contenedor para el logo y nombre */}
      <div className='logo-container'>
            <Link className='inline-flex items-center text-white' to='/'>
              <img
                src='https://res.cloudinary.com/dnm7asoe3/image/upload/v1722473489/Image_Estetica/Estetica_Principal_BINA3_iejitd.png'
                className='w-20 h-20'
                alt='Logo Estetica'
              />
              <span className='text-xl font-bold'>Estética Principal</span>
            </Link>
          </div>
          <div className='block md:hidden'>
            <button onClick={() => setIsOpen(!isOpen)} className='text-white focus:outline-none'>
              <svg className='w-6 h-6 ' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
              </svg>
            </button>
          </div>
          <div
            ref={dropdownRef}
            className={`fixed top-0 left-0 mobile-nav bg-gray-800 h-full z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
          >
            <div className='flex items-center justify-between p-4'>
              <Link className='inline-flex items-center text-white' to='/'>
                <img
                  src='https://res.cloudinary.com/dnm7asoe3/image/upload/v1722473489/Image_Estetica/Estetica_Principal_BINA3_iejitd.png'
                  className='w-12 h-12 md:w-20 md:h-20'
                  alt='Logo Estetica'
                />

                <span className='ml-2 text-xl font-bold'>Estética Principal</span>
              </Link>
            </div>
            <ul className='mt-8 space-y-4'>
              {customer ? (
                <>
                  <li >
                    <Link to='/mi-perfil' className='block px-4 py-2 text-white hover:bg-yellow-500'>Mi Perfil</Link>
                  </li>
                  <li className='block px-4 py-2 text-gray-800 hover:bg-yellow-500 hover:text-white'>
                    <Link to='/configuracion' className='block px-4 py-2 text-white hover:bg-yellow-500'>Configuración</Link>
                  </li>
                  <li className='block px-4 py-2 text-gray-800 hover:bg-yellow-500 hover:text-white'>
                    <Link to='/user-info/mis-compras' className='block px-4 py-2 text-white hover:bg-yellow-500'>Mis Compras</Link>
                  </li>
                  {MenuItemsPrivate.map((item) => (
                    <li key={item.title}>
                      <Link to={item.url} className='block px-4 py-2 text-white hover:bg-yellow-500'>
                        {item.title} {item.icons ? ' Carrito de Compras' : ''}
                      </Link>
                    </li>
                  ))}

                  <li className='block px-4 py-2 text-white bg-red-500 hover:bg-red-600 hover:text-white'>
                    <button onClick={logoutUser}>Cerrar Sesión</button>
                  </li>
                </>

              ) : (
                MenuItems.map((item) => (
                  <li key={item.title}>
                    <Link to={item.url} className='block px-4 py-2 text-white hover:bg-yellow-500'>
                      {item.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Menú para vista de escritorio */}
          <div className='hidden md:flex items-center space-x-6'>
            {customer ? (
              <>
                {MenuItemsPrivate.map((item) => (
                  <Link key={item.title} to={item.url} className='text-white hover:text-yellow-500'>
                    {item.title} {item.icons}
                  </Link>
                ))}
                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='flex items-center text-white focus:outline-none'
                  >
                    <img
                      src={customer.image || 'URL_DE_IMAGEN_GENERICA'}
                      alt='Avatar'
                      className='w-8 h-8 rounded-full'
                    />
                    <span className='ml-2'>{customer.name + ' ' + customer.last_name1}</span>
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
                        <Link to='/user-info/mis-compras'>Mis Compras</Link>
                      </li>
                      <li className='block px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white'>
                        <button onClick={logoutUser}>Cerrar Sesión</button>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            ) : (
              MenuItems.map((item) => (
                <Link key={item.title} to={item.url} className='text-white hover:text-yellow-500'>
                  {item.title}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
