import React from "react";
import Portada from '../../Image/portada.png';
import CarouselC from "../../features/Productos/CarouselC.js";
const Home = () => {
    return (
        <div className="container mx-auto">
            <header className="flex items-center py-8 md:py-12 sm:py-20  lg:py-16 shadow-lg bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center">
                        <div className="sm:w-1/2 flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                            <h2 className="mb-3 text-black text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                                ¡Tu Lugar de Cuidado Personal y Belleza, A un Click de Distancia!
                            </h2>
                            <h4 className="mb-5 text-base sm:text-lg md:text-xl">
                                ¡Bienvenido a nuestro salón de belleza y cuidado personal! Te ofrecemos los mejores servicios para que te veas y te sientas increíble. ¡Reserva tu cita ahora mismo!
                            </h4>
                        </div>
                        <div className="sm:w-1/2 mt-4 sm:mt-0">
                            <img src={Portada} alt="Portada" className="w-full h-auto object-cover rounded-lg shadow-md" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="h-auto">
                <div className="mb-8 mt-6">
                    <div className="Category py-1 rounded-md shadow-md">
                        <h3 className="text-center text-white text-2xl sm:text-3xl md:text-4xl">
                            Productos más vendidos
                        </h3>
                    </div>
                </div>
                <CarouselC />
            </div>
            <div className="mt-20">
                <div className="Category">
                    <h3 className="fs-1 text-center text-white">Servicios Ofrecidos</h3>
                </div>
            </div>
        </div>
    )
}

export default Home;