import React, { useState } from 'react';
import './App.css';
import NavBar from './Componentes/NavBar/NavBar';
import { Routes, Route } from 'react-router-dom';
import Footer from './Componentes/Footer.js';
import Home from './Screens/Home.js';
import Login from './Screens/Login/Login.js';
import Register from './Screens/Login/Register.js';
import Recuperacion from './Screens/Login/Recuperacion.js';
import Error404 from './Screens/Error/404.js';
import Productos from './Screens/Productos/Productos.js';
import { Breadcrumb } from 'react-bootstrap';
import Error500 from './Screens/Error/500.js';

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
    <div>
      <NavBar onSearch={handleSearch} />
      <Breadcrumb />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/productos' element={<Productos searchTerm={searchTerm} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login/recuperacion' element={<Recuperacion />} />
        <Route path='*' element={<Error404 />} />
        <Route path='/Error-500' element={<Error500/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
