import React, { useState } from 'react';
import '../../CSS/NavBar.css'
import Carrito from '../Productos/Compras/Carrito';
import DatosPersonales from './DatosPersonales';
import DomicilioUser from './Domicilio';
import SecurityScreen from './Security';
import DetailsOrder from '../Productos/Compras/DetailsCart';
import CitasAgendadas from './MisCitas';
const PerfilUsuario = () => {
  const [seccionActual, setSeccionActual] = useState('Datos Personales');

  const renderizarSeccion = () => {
    switch (seccionActual) {
      case 'Datos Personales':
        return <DatosPersonales />;
      case 'Datos de la Cuenta':
        return <DomicilioUser />;
      case 'Mi Domicilio':
        return <DomicilioUser/>;
      case 'Seguridad':
        return <SecurityScreen />;
      case 'Privacidad':
        return <DetailsOrder />;
        case 'Citas':
        return <CitasAgendadas />;
      default:
        return <DatosPersonales />;
    }
  };

  return (
    <div className='container mt-4 py-4'>
      <div className="d-flex justify-content-center mb-4 title">
      <div className={`titulo-menu ${seccionActual === 'Datos Personales' ? 'seleccionado' : ''}`} onClick={() => setSeccionActual('Datos Personales')}>Datos Personales</div>
        <div className={`titulo-menu ${seccionActual === 'Mi Domicilio' ? 'seleccionado' : ''}`} onClick={() => setSeccionActual('Mi Domicilio')}>Mi Domicilio</div>
        <div className={`titulo-menu ${seccionActual === 'Seguridad' ? 'seleccionado' : ''}`} onClick={() => setSeccionActual('Seguridad')}>Seguridad</div>
        <div className={`titulo-menu ${seccionActual === 'Privacidad' ? 'seleccionado' : ''}`} onClick={() => setSeccionActual('Privacidad')}>Mis Compras</div>
        <div className={`titulo-menu ${seccionActual === 'Citas' ? 'seleccionado' : ''}`} onClick={() => setSeccionActual('Citas')}>Mis Citas</div>

      </div>
      <div className="text-center">
        {renderizarSeccion()}
      </div>
    </div>
  );
};

export default PerfilUsuario;
