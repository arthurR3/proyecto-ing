import React, { useState } from 'react';
import './App.css'
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

function App() {
  // App.js
  /* const routes = [
    { path: '/', breadcrumb: 'Inicio', component: Home },
    { path: '/productos', breadcrumb: 'Productos', component: Productos },
    { path: '/login', breadcrumb: 'Login', component: Login },
    { path: '/register', breadcrumb: 'Registro', component: Register },
  ];
 */
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className='App'>
      <NavBar onSearch={handleSearch} />
      <div className='content'>
      <Breadcrumb />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/productos' element={<Productos searchTerm={searchTerm} />} />
        <Route path='/agendamiento-cita' element={<AgendarCita/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/recover-password' element={<Recuperacion />} />
        <Route path='/verify-email/:correo' element={<ValidationEmail/>}/>
        <Route path='/change-password/:correo' element={<ChangePassword/>}/>
        <Route path='*' element={<Error404 />} />
        <Route path='/Error-500' element={<Error500/>}/>
      </Routes>
      <Footer/>
      <ToastContainer/>
      </div>
    </div>
  );
}

export default App;
