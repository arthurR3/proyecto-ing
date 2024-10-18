import React, { useEffect, useState } from 'react';
import CalendarComponent from '../../Components/Calendar/Caledar.js';
import axios from 'axios';
import ApiConnection from '../../Components/Api/ApiConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const URLConnection = ApiConnection();

const DashboardAdmin = () => {
  const navigation = useNavigate();
  const [stats, setStats] = useState({
    citas: {
      confirmadas: 0,
      pendientes: 0,
      canceladas: 0,
      atendidas: 0,
      total: 0
    },
    ventas: {
      total: 0,
    }
  });

  useEffect(() => {
    // Fetch stats for citas
    axios.get(`${URLConnection}/dates/counts/status`)
      .then(response => {
        setStats(prevStats => ({
          ...prevStats,
          citas: {
            ...prevStats.citas,
            ...response.data
          }
        }));
      })
      .catch(error => {
        toast.error('Error fetching citas stats');
      });

    axios.get(`${URLConnection}/dates/total/total-attended`)
      .then(response => {
        setStats(prevStats => ({
          ...prevStats,
          citas: {
            ...prevStats.citas,
            total: response.data.total,
          }
        }));
      })
      .catch(error => {
        toast.error('Error fetching citas stats');
      });

    // Fetch stats for ventas
    axios.get(`${URLConnection}/sales/total/total-attended`)
      .then(response => {
        setStats(prevStats => ({
          ...prevStats,
          ventas: response.data
        }));
      })
      .catch(error => {
        toast.error('Error fetching ventas stats');
      });
  }, []);

  return (
    <div className="container mx-auto py-5 mt-4">
      <div className="mb-3">
        <div className="flex items-center p-3 bg-white shadow-lg rounded">
          <div className="flex justify-center items-center bg-primary text-white text-2xl rounded-full mr-3 w-16 h-16">
            <i className="fa-solid fa-user-tie"></i>
          </div>
          <div>
            <span className="block text-xl font-bold">Administrador</span>
            <span className="block text-gray-500">Estética Principal Emma</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart Card */}
        <div className="lg:col-span-2 mb-3">
          <div className="bg-white shadow-lg rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <strong>Calendario de citas agendadas</strong>
            </div>
            <div className="p-4 flex justify-center items-center" style={{ height: '300px' }}>
              <div className="text-gray-500 text-center">
                <div className="flex justify-center items-center h-full border border-dashed border-gray-300 rounded">
                  <CalendarComponent />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-white shadow-lg rounded">
            <div className="flex justify-center items-center bg-green-500 text-white text-2xl rounded-full mr-3 w-16 h-16">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div>
              <span className="block text-2xl font-bold">{stats.citas.atendidas}</span>
              <span className="block text-gray-500">Citas atendidas</span>
            </div>
          </div>

          <div className="flex items-center p-3 bg-white shadow-lg rounded cursor-pointer" onClick={() => navigation('/admin/admin/citas-list')}>
            <div className="flex justify-center items-center bg-green-500 text-white text-2xl rounded-full mr-3 w-16 h-16">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div>
              <span className="block text-2xl font-bold">{stats.citas.confirmadas}</span>
              <span className="block text-gray-500">Citas agendadas para esta semana</span>
            </div>
          </div>

          <div className="flex items-center p-3 bg-white shadow-lg rounded cursor-pointer" onClick={() => navigation('/admin/admin/citas-list?filter=pendiente')}>
            <div className="flex justify-center items-center bg-yellow-500 text-white text-2xl rounded-full mr-3 w-16 h-16">
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
            <div>
              <span className="block text-2xl font-bold">{stats.citas.pendientes}</span>
              <span className="block text-gray-500">Citas pendientes por confirmar</span>
            </div>
          </div>
        </div>

        {/* Ingresos Totales */}
        <h4 className="font-bold lg:col-span-3 mt-4">Ingresos Totales</h4>

        <div className="space-y-4 lg:col-span-3 lg:grid lg:grid-cols-3 lg:gap-4">
          <div className="flex items-center p-3 bg-white shadow-lg rounded">
            <div className="flex justify-center items-center bg-gray-600 text-white rounded-full mr-3 w-16 h-16">
              <i className="fas fa-pie-chart"></i>
            </div>
            <div>
              <span className="block text-2xl font-bold">$ {stats.ventas.total}</span>
              <span className="block text-gray-500">Ingresos por ventas realizadas</span>
            </div>
          </div>

          <div className="flex items-center p-3 bg-white shadow-lg rounded">
            <div className="flex justify-center items-center bg-gray-600 text-white rounded-full mr-3 w-16 h-16">
              <i className="fas fa-pie-chart"></i>
            </div>
            <div>
              <span className="block text-2xl font-bold">$ {stats.citas.total}</span>
              <span className="block text-gray-500">Ingresos por citas realizadas</span>
            </div>
          </div>

          <div className="flex items-center p-3 bg-white shadow-lg rounded cursor-pointer" onClick={() => navigation('/admin/admin/citas-list?filter=Cancelada')}>
            <div className="flex justify-center items-center bg-red-500 text-white text-2xl rounded-full mr-3 w-16 h-16">
              <i className="fa-solid fa-ban"></i>
            </div>
            <div>
              <span className="block text-2xl font-bold">{stats.citas.canceladas}</span>
              <span className="block text-gray-500">Citas canceladas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
