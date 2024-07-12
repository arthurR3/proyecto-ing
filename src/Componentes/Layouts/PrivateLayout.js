import React from 'react';
import {NavBarAdmin} from '../NavBar/NavBar.js';
import Footer from '../Footer.js';

function PrivateLayout({ children }) {
    return (
        <div className='public -layout'>
            <NavBarAdmin />
            <div className='content'>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default PrivateLayout