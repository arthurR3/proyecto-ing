import React from 'react';
import './App.css';
import NavBar from './Componentes/NavBar/NavBar';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Componentes/Footer.js';
import Home from './Screens/Home.js';
import Login from './Screens/Login/Login.js';
import Register from './Screens/Login/Register.js';
import Recuperacion from './Screens/Login/Recuperacion/Recuperacion.js';
import ValidationEmail from './Screens/Login/Recuperacion/validationEmail.js';
import ChangePassword from './Screens/Login/Recuperacion/changePassword.js';
import Error404 from './Screens/Error/404.js';
import Productos from './Screens/Productos/Productos.js';
import { Breadcrumb } from 'react-bootstrap';
import Error500 from './Screens/Error/500.js';
import AgendarCita from './Screens/Citas/agendarCita.js';
import Carrito from './Screens/Productos/Compras/Carrito.js';
import { AuthProvider } from './Componentes/Context/AuthContext.js';
import { CartProvider } from './Componentes/Context/CarritoContext.js';
import PrivateRoute from './Componentes/Context/PrivateRoute.js';
import PreguntaSecreta from './Screens/Login/Recuperacion/PreguntaSecreta.js';
import AddressScreen from './Screens/Productos/Compras/AddressScreen.js';
import DetailsOrder from './Screens/Productos/Compras/DetailsCart.js';
import DemandaEstetica from './Screens/Services/DemandaServicios.js';
import InfoUser from './Screens/Users/InfoUser.js';
import DatosPersonales from './Screens/Users/DatosPersonales.js';
import Service from './Screens/Services/Service.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import DomicilioUser from './Screens/Users/Domicilio.js';
import SecurityScreen from './Screens/Users/Security.js';
import CitasAgendadas from './Screens/Users/MisCitas.js';
import Terminos from './Screens/Terms&Conditions/Terminos.js';
import Products from './Screens/admin/ActionsProducts.js';
import ServicesList from './Screens/Services/ServicesList.js';
import Agenda from './Screens/Services/Agenda.js';
import PrivacyPolicy from './Screens/Terms&Conditions/AvisoPrivacidad.js';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <div className='content'>
        <Breadcrumb />
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/productos' element={<Productos />} />
                <Route path='/Login' element={<Login />} />
                <Route path='/Login/register' element={<Register />} />
                <Route path='/Login/recuperacion/recover-password/:method' element={<Recuperacion />} />
                <Route path='/Login/verificacion/verify-email/:method/:correo' element={<ValidationEmail />} />
                <Route path='/Login/recuperacion/recuperacion/secret-question/:correo' element={<PreguntaSecreta />} />
                <Route path='/Login/change/change-password/:correo' element={<ChangePassword />} />
                <Route path='/User-info/' element={<PrivateRoute><InfoUser /> </PrivateRoute>} />
                <Route path='/shop-cart' element={<PrivateRoute><Carrito /></PrivateRoute>} />
                <Route path='/shop-cart/select-address' element={<PrivateRoute><AddressScreen /></PrivateRoute>} />
                <Route path='/shop-cart/details' element={<PrivateRoute><DetailsOrder /></PrivateRoute>} />
                <Route path='/book-appointments' element={<AgendarCita />} />
                <Route path='/Politicas/Terminos y Condiciones' element={<Terminos />} />
                <Route path='/Politicas/Aviso de Privacidad' element={<PrivacyPolicy/>} />
                <Route path='*' element={<Error404 />} />
                <Route path='/Error-500' element={<Error500 />} />
                <Route path='/user-info/datosPersonal' element={<PrivateRoute><DatosPersonales /></PrivateRoute>}></Route>
                <Route path='/user-info/Personal-security' element={<PrivateRoute><SecurityScreen /></PrivateRoute>}></Route>
                <Route path='/user-info/direccion' element={<PrivateRoute><DomicilioUser /></PrivateRoute>}></Route>
                <Route path='/user-info/citas-agendadas' element={<PrivateRoute><CitasAgendadas /></PrivateRoute>}></Route>
                <Route path='/servicios' element={<Service />} />
                <Route path='/servicios/categories/:category' element={<ServicesList/>} />
                <Route path='/demandas-servicios' element={<DemandaEstetica />} />
                <Route path='/servicios/agendar-cita/:id' element={<Agenda/>}/> 

               // Parte administradora del Sitio web
                <Route path='/admin/add-products' element={<Products />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
