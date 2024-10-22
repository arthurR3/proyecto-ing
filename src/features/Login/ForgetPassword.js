import React from 'react'
import { useNavigate } from 'react-router-dom';

const ForgetedPass =({ onClose })  =>{
    const navigate = useNavigate()
    return (
        <div className="fixed bg-black bg-opacity-50  inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-purple-600 font-semibold">Restablecer Contraseña</h2>
                    <button
                        onClick={onClose} // Añadir la función de cierre aquí
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-gray-500 mb-6">Selecciona una opción para restablecer tu contraseña.</p>
                <div className="space-y-4">
                    <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none"
                        onClick={()=> navigate(`/login/forgeted-password/code`)}>
                        <span>Enviando un token por correo</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none">
                        <span>Respuesta a mi pregunta secreta</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                    
                </div>
                <div className="mt-6">
                    <button 
                        onClick={onClose}
                        className="w-full text-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgetedPass