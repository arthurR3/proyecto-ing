import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBarAdmin } from '../NavBar/NavBar.js';
import Footer from '../Footer.js';

function PrivateLayout({ children }) {
  return (
    <>
      <NavBarAdmin />
      <div className='mt-4 py-5'>
        {children || <Outlet />}
      </div>
      <Footer/>
    </>
  );
}

export default PrivateLayout;
