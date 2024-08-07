import React from "react";
import '../CSS/NavBar.css'
import '../CSS/Carrusel.css'
import { CitaBtn } from "../Componentes/NavBar/MenuItems";
import Portada from '../Image/portada.png'

import {CarouselC, CarouselService} from "../Componentes/Carrusel/CarouselC";

const Home = () => {
 
    return (
        <div className="home-page">
            <header className="h-100 min-vh-100 d-flex align-items-center text-light mt-5 shadow">
                <div className="container m-50">
                    <div className="row">
                        <div className="col-sm-6 d-flex d-sm-block flex-column align-items-center">
                            <h2 className="mb-3 text-black fs-20">Tu Lugar de Cuidado Personal y Belleza, A un Click de Distancia</h2>
                            <h4 className="mb-5 text-black fs-10">¡Bienvenido a nuestro salón de belleza y cuidado personal! Te ofrecemos los mejores
                                servicios
                                para que te veas y te sientas increíble. ¡Reserva tu cita ahora mismo!</h4>
                            <CitaBtn />
                        </div>
                        <div className="col-sm-6">
                            {/* <img src="https://i0.wp.com/foodandpleasure.com/wp-content/uploads/2022/03/boticanatural.jpg?w=1080&ssl=1" alt='portada' className="h-auto w-100" onStalled={handleStalled}/> */}
                            <img src={Portada} alt='portada' className="h-auto w-100" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Productos mas vendidos */}

            <div className="ContCarr">
                <div className="Category">
                    <h3 className="fs-1 text-center text-white">Productos más vendidos</h3>
                </div>

                <CarouselC />
            </div>
            <div className="ContCarr">
                <div className="Category">
                    <h3 className="fs-1 text-center text-white">Servicios Ofrecidos</h3>
                </div>

                <CarouselService />
            </div>
        </div>
    )
}

export default Home;