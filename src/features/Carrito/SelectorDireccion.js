import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SelectorDireccion = ({direccion, onSeleccion}) => {
  const [locationStore, setLocationStore] = useState(false)
  const [locationHome, setLocationHome] = useState(false)
  const direccionUser = Array(direccion)
 
  const handleSelection = (e) => {
    const value = e.target.value;

    if(value === 'fisica'){
      setLocationStore(true)
      setLocationHome(null)  
      onSeleccion('fisica', false)
    } else {
      setLocationStore(false)
      const selectedAddress = direccionUser.find(dir => dir.id === parseInt(value))
      setLocationHome(selectedAddress)  
      onSeleccion(Number(value), true)
    }
  }
  
  /*  */
  return (
    <div className='bg-white shadow-lg rounded-lg overflow-hidden mb-8'>
        <div className='p-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            <i className="fa-solid fa-location-dot me-2"></i>
            Seleccionar Dirección
            </h2>
            <select onClick={handleSelection}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            >
                <option value="">Selecciona una dirección</option>
                {direccionUser?.map((direccion) => (
                  <option key={direccion.id} value={direccion.id}>
                    Calle {direccion.street}, Col. {direccion.cologne}
                  </option>
                ))}
                <option value='fisica'>Recoger en Tienda - GRATIS</option>
            </select>
            {locationStore && (
              <div className='mt-4 p-4 bg-gray-100 rounded-md'>
                <h3 className='text-lg font-semibold text-gray-600 mb-2 flex item-center'>
                <i class="fa-solid fa-shop me-2"></i>
                  Ubicación de la estética
                </h3>
                <p className='text-gray-500'>Calle Revolución, Centro, 43000 Huejutla de Reyes</p>
              </div>
            )}
            {locationHome && (
              <div className='mt-4 p-4 bg-gray-100 rounded-md'>
                <h3 className='text-lg font-semibold text-gray-600 mb-2 flex item-center'>
                <i className="fa-solid fa-house me-3"></i>
                  Ubicación mi domicilio
                </h3>
                <p className='text-gray-500'>Calle {locationHome.street}, Col. {locationHome.cologne}, {locationHome.municipality}</p>
              </div>
            )}
            
        </div>
    </div>
  )
}

export default SelectorDireccion