import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const tokenDecoded = jwtDecode(token);
      setUser(tokenDecoded);

      // Set timer for automatic logout
      const expirationTime = tokenDecoded.exp * 1000 - Date.now();
      if (expirationTime > 0) {
        const timer = setTimeout(() => {
          logout();
        }, expirationTime);
        return () => clearTimeout(timer);
      } else {
        logout(); // Token already expired
      }
    }
  }, [token]);

  const authToken = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
    const tokenDecoded = jwtDecode(token);
    setUser(tokenDecoded);

    // Set timer for automatic logout
    const expirationTime = tokenDecoded.exp * 1000 - Date.now();
    const timer = setTimeout(() => {
      logout();
    }, expirationTime);
    
    return () => clearTimeout(timer);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, authToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
