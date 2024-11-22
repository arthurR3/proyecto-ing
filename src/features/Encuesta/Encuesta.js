import React, { useState } from "react";
import { Rating } from "primereact/rating";
import axios from "axios";
import ApiConnection from "../../Components/Api/ApiConfig";

const URLConnection = ApiConnection();

const Encuesta = ({ id_user, onComplete }) => {
    const [value, setValue] = useState(null);
    const [value2, setValue2] = useState(null);
    const [value3, setValue3] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = {
            id_user: id_user,
            question1: value,
            question2: value2,
            question3:value3,
            createdAt: new Date(),
        };

        try {
            const response = await axios.post(`${URLConnection}/survey`, data);
            if (response.data.success) {
                console.log("Encuesta enviada con éxito:", response.data);
                onComplete(); // Llamar la función cuando se complete correctamente
            } else {
                setError("Hubo un problema al enviar la encuesta. Intente nuevamente.");
            }
        } catch (error) {
            console.error("Error al enviar la encuesta:", error);
            setError("Error al enviar la encuesta. Verifique su conexión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
            style={{ height: "100vh", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}
            >
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-gray-500">Encuesta de satisfacción</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Por favor, ayúdanos a evaluar el proceso mediante las siguientes preguntas.
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <h3 className="text-md font-semibold">
                    ¿Qué tan fácil y claro te resultó seleccionar el servicio y elegir el horario para tu cita?
                    </h3>
                    <div className="flex justify-center">
                        <Rating value={value} onChange={(e) => setValue(e.value)} cancel={false} style={{ gap: 20 }} />
                    </div>
                    <h3 className="text-md font-semibold">¿Qué tan útiles y claras fueron las notificaciones enviadas durante el proceso de reserva?</h3>
                    <div className="flex justify-center">
                        <Rating value={value2} onChange={(e) => setValue2(e.value)} cancel={false} style={{ gap: 20 }} />
                    </div>
                    <h3 className="text-md font-semibold">¿Cómo calificarías tu experiencia general con el proceso de reserva?</h3>
                    <div className="flex justify-center">
                        <Rating value={value3} onChange={(e) => setValue3(e.value)} cancel={false} style={{ gap: 20 }} />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div>
                        <button
                            className={`w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg ${(!value || !value2 || !value3 || loading) ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            type="submit"
                            disabled={!value || !value2|| !value3 || loading}
                        >
                            {loading ? "Enviando..." : "Enviar encuesta"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Encuesta;
