import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import ApiConnection from "../../../Components/Api/ApiConfig";
import LoadingSpinner from "../../../Components/Loading/Loading";

// Registrar elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const URLConnection = ApiConnection();

const DashboardEncuestas = () => {
    const [surveyData, setSurveyData] = useState([]);
    const [totales, setTotales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                const response = await axios.get(`${URLConnection}/survey/`);
                const response2 = await axios.get(`${URLConnection}/survey/total/survey`)
                console.log("Datos recibidos:", response.data);
                setSurveyData(response.data.data || []);
                setTotales(response2.data.data || 0);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar los datos de la encuesta:", err);
                setError("Error al cargar los datos de la encuesta.");
                setLoading(false);
            }
        };
        fetchSurveyData();
    }, []);

    const processChartData = (questionKey) => {
        const counts = [0, 0, 0, 0, 0];
        surveyData.forEach((item) => {
            const rating = item[questionKey];
            if (rating >= 1 && rating <= 5) counts[rating - 1] += 1;
        });
        return counts;
    };

    const question1Data = processChartData("question1");
    const question2Data = processChartData("question2");
    const question3Data = processChartData("question3");


    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1, // Cambia el valor para ajustar el tamaño relativo (1 = cuadrado)
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Puntuación ${context.label}: ${context.raw} respuestas`,
                },
            },
        },
    };


    const createChartData = (data, label) => ({
        labels: ["Muy insatisfecho", "Insatisfecho", "Neutral", "Satisfecho", "Muy satisfecho"],
        datasets: [
            {
                label,
                data,
                backgroundColor: [
                    "#FF3B3B", // Muy insatisfecho
                    "#FF7F50", // Insatisfecho
                    "#FFD700", // Neutral
                    "#7FFF7F", // Satisfecho
                    "#00B200", // Muy satisfecho
                ],
                hoverOffset: 4,
            }
        ],
    });

    if (loading) return (<LoadingSpinner/>);
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
         <div className="mb-3">
        <div className="flex items-center p-3 bg-white shadow-lg rounded">
          <div className="flex justify-center items-center bg-primary text-white text-2xl rounded-full mr-3 w-16 h-16">
            <i className="fa-solid fa-user-tie"></i>
          </div>
          <div>
            <span className="block text-2xl font-bold">Evaluación del proceso</span>
            <span className="block text-xl text-gray-500">Para Reservar citas</span>
            <span className="block font-bold text-sm">No. usuarios:</span><span className="">{totales} usuarios han realizado la encuesta</span>
          </div>
        </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold text-gray-700 mb-4">¿Qué tan fácil te resultó seleccionar el servicio?</h3>
                <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
                    <Pie data={createChartData(question1Data, "Claridad del proceso")} options={chartOptions} />
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold text-gray-700 mb-4">¿Qué tan claro y fácil te resultó elegir el horario para tu cita?</h3>
                <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>

                    <Pie data={createChartData(question2Data, "Confirmación rápida")} options={chartOptions} />
                </div>

            </div>
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold text-gray-700 mb-4">¿Cómo calificarías tu experiencia general con el proceso de reserva?</h3>
                <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>

                    <Pie data={createChartData(question3Data, "Confirmación rápida")} options={chartOptions} />
                </div>

            </div>
        </div>
        </div>
    );
};

export default DashboardEncuestas;
