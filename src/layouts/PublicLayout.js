import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Components/nav/NavBar.js';
import Footer from '../Components/footer/Footer.js';

function PublicLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className=' mt-32 py-42'>  
        {children || <Outlet />}
      </div>
      <Footer/>
    </>
  );
}

export default PublicLayout;
