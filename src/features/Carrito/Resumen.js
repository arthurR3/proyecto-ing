import React from 'react'

const Resumen = ({productos, costoEnvio}) => {
    const subtotal = productos.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const total = subtotal + costoEnvio;
  return (
    <div className='bg-white shadow-lg rounded-lg overflow-hidden mb-8'>
        <div className='p-6'>
            <h2 className='text-2xl font-semibold text-gray-600 mb-4'>
                Resumen de la Compra
            </h2>
            {productos.map((producto) =>(
                <div className='flex justify-between py-2'>
                <span className='text-gray-600'>{producto.name} x{producto.quantity}</span>
                <span className='font-medium text-gray-600'>${(producto.price * producto.quantity).toFixed(2)}</span>
            </div>

            ))}
            <div className='border-t border-gray-200 mt-4 pt-4'>
                <div className='flex justify-between items-center'>
                    <span className='text-lg font-semibold text-gray-600'>Subtotal</span>
                    <span className='text-2xl font-bold text-purple-600'>${subtotal.toFixed(2)}</span>
                </div>
            </div>
            <div className='border-t border-gray-200 mt-4 pt-4'>
                <div className='flex justify-between items-center'>
                    <span className='text-lg font-semibold text-gray-600'>Costo de envío:</span>
                    <span className='text-2xl font-bold text-purple-600'>${costoEnvio.toFixed(2)}</span>
                </div>
            </div>
            <div className='border-t border-gray-200 mt-4 pt-4'>
                <div className='flex justify-between items-center'>
                    <span className='text-lg font-semibold text-gray-600'>Total</span>
                    <span className='text-2xl font-bold text-purple-600'>${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Resumen