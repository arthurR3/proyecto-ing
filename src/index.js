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

import { Workbox } from "workbox-window";

if ("serviceWorker" in navigator) {
  const wb = new Workbox("./services-worker.js");
  wb.register();
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AdminAuthProvider>
        <CarritoContext>
          <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
            <App />
          </PrimeReactProvider>
        </CarritoContext>
      </AdminAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);


reportWebVitals();
