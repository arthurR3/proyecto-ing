import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar.js';
import Footer from '../Footer.js';

function PublicLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className='mt-4 py-5'>  
        {children || <Outlet />}
      </div>
      <Footer/>
    </>
  );
}

export default PublicLayout;
