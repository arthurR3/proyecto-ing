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

function App() {
  return (
    <div className='App'>
      <NavBar />
      <div className='content'>
        <Breadcrumb />
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
              <Route path='/shop-cart' element={<PrivateRoute><Carrito /></PrivateRoute>} />
              <Route path='/shop-cart/select-address' element={<PrivateRoute><AddressScreen /></PrivateRoute>} />
              <Route path='/book-appointments' element={<AgendarCita />} />
              <Route path='*' element={<Error404 />} />
              <Route path='/Error-500' element={<Error500 />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
