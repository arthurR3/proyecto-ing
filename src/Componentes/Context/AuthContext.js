import React, { createContext, useContext, useEffect, useState } from 'react';
import SessionStorage from '../sessionStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(SessionStorage.getSession()?.userData)
  const [isAuthenticated, setIsAuthenticated] = useState(SessionStorage.hasSession())

  useEffect(()=> {
    setIsAuthenticated(SessionStorage.hasSession());
    setToken(SessionStorage.getSession()?.userData)
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
