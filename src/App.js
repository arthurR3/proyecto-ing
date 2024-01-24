import React from 'react';
import './App.css';
import NavBar from './Componentes/NavBar/NavBar';
import {Routes, Route } from 'react-router-dom';
import Home from './Screens/Home.js';
import Login from './Screens/Login/Login.js';
import Register from './Screens/Login/Register.js';
import Error404 from './Screens/Error/404.js';
import Productos from './Screens/Productos/Productos.js';

function App() {
  return (
      <div>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/productos' element={<Productos/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
    
          <Route path='*' element={<Error404/>}/>
        </Routes>
        <footer>
          <p>©Camps 2023 && Estética Principal, Inc.</p>
        </footer>
      </div>
  );
}

export default App;
