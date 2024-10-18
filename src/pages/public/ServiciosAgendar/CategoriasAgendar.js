import React from "react";
import ServiceCarousel from "../../../features/Servicios/CarouselServicios";
const img = 'https://www.beautymarket.es/imagen/min18484.jpg'

const Service = () => {
    return (
        <div>
            <div className="flex flex-col h-auto">
                <header className="text-primary-foreground py-12 mb-12 md:py-16 ">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                            <div className="space-y-4">
                                <h1 className="text-4xl text-purple-700 font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                    Servicios de Belleza para tí!
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl">
                                    Descubre la excelencia en cada detalle con nuestros servicios personalizados para tu cuidado.
                                </p>
                            </div>
                            <img
                                src={img}
                                width="600"
                                height="400"
                                alt="Beauty Services"
                                className="mx-auto rounded-xl shadow-lg"
                                style={{ aspectRatio: "600/400", objectFit: "cover" }}
                            />
                        </div>
                    </div>
                </header>
                <h3 className="text-center text-3xl text-purple-700 font-semibold mb-12">Selecciona una categoria :</h3>
                <div className="">
                    <ServiceCarousel />
                </div>
            </div>
        </div>
    );
}
export default Service;