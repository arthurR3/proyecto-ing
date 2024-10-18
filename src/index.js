import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from "primereact/api";
import reportWebVitals from './reportWebVitals';
import Tailwind from 'primereact/passthrough/tailwind';
import './index.css';
import 'primeicons/primeicons.css';
import App from './App';
import { AuthProvider } from './Components/Context/AuthContext';
import { AdminAuthProvider } from './Components/Context/AdminAuthContext';
import CarritoContext from './Components/Context/CarritoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
  <AdminAuthProvider>
    <CarritoContext>
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: true, pt:  Tailwind}}>
    <App />
    </PrimeReactProvider>
  </React.StrictMode>
  </CarritoContext>
  </AdminAuthProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
