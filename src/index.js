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
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js'


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
        <CarritoContext>
          <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
            <App />
          </PrimeReactProvider>
        </CarritoContext>
    </AuthProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register()
reportWebVitals();
