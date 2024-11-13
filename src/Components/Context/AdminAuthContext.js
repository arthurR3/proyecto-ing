import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdmin(decoded);

        const expirationTime = decoded.exp * 1000 - Date.now();
      if (expirationTime > 0) {
        const timer = setTimeout(() => {
          adminLogout();
        }, expirationTime);
        return () => clearTimeout(timer);
      } else {
        adminLogout(); // Token already expired
      }
      } catch (error) {
        console.error('Error decoding token:', error);
        setAdmin(null); // Si hay un error decodificando el token, reinicia el estado
      }
    }
  }, [token]);

  const setAdminAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("adminToken", newToken);

    try {
      // Decodifica el token para obtener la información del administrador
      const decoded = jwtDecode(newToken);
      setAdmin(decoded);

      const expirationTime = decoded.exp * 1000 - Date.now();
    const timer = setTimeout(() => {
      adminLogout();
    }, expirationTime);
    
    return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error decoding token:', error);
      setAdmin(null); // Si hay un error decodificando el token, reinicia el estado
    }
  };

  const adminLogout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');

  };

  return (
    <AdminAuthContext.Provider value={{ token, admin, setAdminAuthToken, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);