import React from 'react'
import ServiceList from '../../features/Servicios/ServiciosList.js';
const img = 'https://www.beautymarket.es/imagen/min18484.jpg'

function Servicios() {
    return (
        <div className='container mx-auto'>
                <header className="flex items-center py-8 md:py-12 sm:py-20 lg:py-16">
                    <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col sm:flex-row items-center">
                        <div className="sm:w-1/2 flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                        <h1 className="text-4xl text-purple-700 font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                    Servicios de Belleza para tí!
                                </h1>
                            <h4 className="mb-5 text-base sm:text-lg md:text-xl">
                            Descubre la excelencia en cada detalle con nuestros servicios personalizados para tu cuidado.
                            </h4>
                        </div>
                        <img
                                src={img}
                                alt="Beauty Services"
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                                style={{ aspectRatio: "600/400", objectFit: "cover" }}
                            />
                    </div>
                    </div>
                </header>

                <main>
                    <div className="container px-4 py-5 md:px-6">
                        <h2 className="text-3xl text-purple-700 font-bold mb-8 md:mb-12">Nuestros Servicios</h2>
                        <ServiceList />
                    </div>
                </main>
            </div>
    );
}

export default Servicios