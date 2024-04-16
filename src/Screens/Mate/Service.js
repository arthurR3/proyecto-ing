import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const servicios = [
    {
        "id": 1,
        "name": "Corte de Pelo",
        "description": "Corte moderno y personalizado",
        "price": 100,
        "duration": "01:00:00",
        "image": "https://cdn.static.escuelamakeup.com/imagenes/cortes-de-pelo-de-mujer-segun-el-tipo-de-cara-o-rostro/cortes-de-pelo-de-mujer-segun-el-tipo-de-cara-o-rostro_905x603.jpg",
        "category": "Cabello",
        "NumCitas": 11
    },
    {
        "id": 2,
        "name": "Maquillaje de Novia",
        "description": "Maquillaje profesional para bodas",
        "price": 500,
        "duration": "02:00:00",
        "image": "https://resizer.sevilla.abc.es/resizer/resizer.php?imagen=https://sevilla.abc.es/estilo/bulevarsur/wp-content/uploads/sites/14/2016/08/diccionario-maquillaje-principiantes.jpg&nuevoancho=652https://resizer.sevilla.abc.es/resizer/resizer.php?imagen=https://sevilla.abc.es/estilo/bulevarsur/wp-content/uploads/sites/14/2016/08/diccionario-maquillaje-principiantes.jpg&nuevoancho=652",
        "category": "Maquillaje",
        "NumCitas": 11
    },
    {
        "id": 3,
        "name": "Tratamiento Facial",
        "description": "Tratamiento rejuvenecedor para la piel",
        "price": 850,
        "duration": "03:00:00",
        "image": "https://www.bellezamarife.com/wp-content/uploads/2015/11/tratamientos-antiedad-y-rejuvenecimiento-1.png",
        "category": "Facial",
        "NumCitas": 11
    },
    {
        "id": 4,
        "name": "Masaje Relajante",
        "description": "Masaje para aliviar el estrés y la tensión",
        "price": 250,
        "duration": "01:30:00",
        "image": "https://www.juvensa.com.mx/wp-content/uploads/2018/07/Header-blog_1_2.jpg",
        "category": "Masaje",
        "NumCitas": 11
    },
    {
        "id": 5,
        "name": "Manicura y Pedicura",
        "description": "Cuidado y esmaltado de uñas",
        "price": 200,
        "duration": "00:00:00",
        "image": "https://i.pinimg.com/originals/16/bb/19/16bb191d86f24cc5451a701e448ca8fc.jpg",
        "category": "Servicio de uñas",
        "NumCitas": 11
    },
    {
        "id": 6,
        "name": "Coloración de Cabello",
        "description": "Cambios de color personalizados",
        "price": 60,
        "duration": "00:00:00",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkPkb6IeJsk3b9yvPks9igpzFkwxSAklrBh_wtCzGhvUNnVFUNwiYg0rmXda4lSjNhV5I&usqp=CAU",
        "category": "Cabello",
        "NumCitas": 11
    },
    {
        "id": 7,
        "name": "Depilación Corporal",
        "description": "Depilación con cera para una piel suave",
        "price": 35,
        "duration": "00:00:00",
        "image": "https://images.fresha.com/lead-images/placeholders/beauty-salon-89.jpg?class=width-small",
        "category": "Depilación",
        "NumCitas": 11
    },
    {
        "id": 8,
        "name": "Peinado de Evento",
        "description": "Peinados elegantes para ocasiones especiales",
        "price": 45,
        "duration": "00:00:00",
        "image": "https://todo-peluqueriayestetica.com/wp-content/uploads/2019/01/peinados-para-una-fiesta-1320x825.jpg",
        "category": "Cabello",
        "NumCitas": 8
    },
    {
        "id": 9,
        "name": "Tratamiento Capilar",
        "description": "Tratamiento intensivo para el cabello",
        "price": 55,
        "duration": "00:00:00",
        "image": "https://campus.icathi.edu.mx/pluginfile.php/142336/course/summary/mejores-tratamientos-capilares.jpg",
        "category": "Cabello",
        "NumCitas": 11
    }
];




const Service = () => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Facial');
    const navigation = useNavigate();
    const serviciosFiltrados = servicios.filter(servicio => servicio.category === categoriaSeleccionada);

    const navigateToDemanda = (servicio) => {
        navigation(`/demandas-servicios/${servicio.name}/${servicio.NumCitas}`);
    };
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Servicios de Belleza</h1>
            <div className="row mb-3">
                <label htmlFor="categoria" className="col-sm-2 col-form-label">Selecciona una categoría:</label>
                <div className="col-sm-4">
                    <select id="categoria" className="form-select" onChange={(e) => setCategoriaSeleccionada(e.target.value)} value={categoriaSeleccionada}>
                    <option value="Facial">Facial</option>
                        <option value="Cabello">Cabello</option>
                        <option value="Maquillaje">Maquillaje</option>
                        <option value="Servicio de uñas">Servicio de uñas</option>
                    </select>
                </div>
            </div>
            <div className="row">
                {serviciosFiltrados.map(servicio => (
                    <div className="col-md-4 mb-4" key={servicio.id} onClick={() => navigateToDemanda(servicio)}>
                        <div className="card">
                            <img src={servicio.image} className="card-img-top" alt={servicio.name} />
                            <div className="card-body">
                                <h5 className="card-title">{servicio.name}</h5>
                                <p className="card-text">{servicio.description}</p>
                                <p className="card-text">Precio: ${servicio.price}</p>
                                <p className="card-text">Duración: {servicio.duration}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Service;