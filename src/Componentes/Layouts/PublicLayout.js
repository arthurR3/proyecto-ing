import React from 'react';
import {NavBar} from '../NavBar/NavBar.js';
import Footer from '../Footer.js';

function PublicLayout({ children }) {
    return (
        <div className='public -layout'>
            <NavBar />
            <div className='content'>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default PublicLayout