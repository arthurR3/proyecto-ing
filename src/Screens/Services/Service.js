import React from "react";
import '../../CSS/citas.css';
import { CarouselService } from "../../Componentes/Carrusel/CarouselC";
const img = 'https://www.beautymarket.es/imagen/min18484.jpg'

const Service = () => {
      return (
        <div className="container py-5 title">
            <h1 className="text-center mb-4 fw-bold">Servicios de Belleza</h1>
            <div className="row mb-3">
                <div className="col-sm-6 d-flex d-sm-block flex-column align-items-center mt-5">
                    <h2 className="mb-4 fs-20 title">
                        Servicios de calidad
                    </h2>
                    <h5 className="mb-5 text-dark fs-10">
                        En Estetica Principal Emma ofrecemos una amplia gama de servicios de belleza.
                        <br /><br />
                        Descubre nuestras categorías y ¡Agenda tu cita hoy mismo!
                    </h5>
                </div>
                <div className="col-sm-6">
                    {/*  https://proexpansion.com/uploads/article/image/2827/larger_maquillaje.jpg*/}
                    <img src={img} className="h-auto w-100" />
                </div>
            </div>
            <h3 className="text-center mb-2 mt-5 fw-bold">Selecciona una categoria :</h3>
            <div className="card-services"> 
                <CarouselService/>
            </div>
        </div>
    );
}
export default Service;