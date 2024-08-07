import React, { createContext, useContext, useEffect, useState } from 'react';
import SessionStorage from '../sessionStorage';
/* import { GoogleOAuthProvider } from '@react-oauth/google';*/
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(SessionStorage.getSession()?.userData)
  const [isAuthenticated, setIsAuthenticated] = useState(SessionStorage.hasSession())

  useEffect(() => {
    setIsAuthenticated(SessionStorage.hasSession());
    setToken(SessionStorage.getSession()?.userData)
  }, []);

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    SessionStorage.removeSession(); // Elimina la sesión del almacenamiento
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
