import React, { useState } from "react";
import { Rating } from "primereact/rating";

const Encuesta = () => {
    const [value, setValue] = useState(null);
    const [value2, setValue2] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Encuesta enviada", { value, value2 });
    };

    return (
        <div className="">
            <div className="fixed ease-in duration-700 inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4 text-gray-500">Encuesta de satisfacción</h2>
                    <p className="text-sm text-gray-500 mb-4">Por favor, ayúdanos a evaluar el proceso mediante las siguientes preguntas.</p>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <h3 className="text-md font-semibold">¿Qué tan fácil y claro te resultó el proceso de reserva, desde la selección del servicio hasta la elección del horario?</h3>
                        <div className="flex justify-center">
                            <Rating value={value} onChange={(e) => setValue(e.value)} cancel={false} style={{ gap: 20 }} />
                        </div>
                        <h3 className="text-md font-semibold">¿Recibiste una confirmación clara y rápida de tu cita?</h3>
                        <div className="flex justify-center">
                            <Rating value={value2} onChange={(e) => setValue2(e.value)} cancel={false} style={{ gap: 20 }} />
                        </div>
                        <div>
                            <button
                                className={`w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg ${(!value || !value2) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={!value || !value2}
                            >
                                Enviar encuesta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Encuesta;
