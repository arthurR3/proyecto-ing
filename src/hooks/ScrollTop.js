// ScrollTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
};

export default ScrollTop;
