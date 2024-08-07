import React, { useEffect, useState } from 'react';
import CalendarComponent from '../../Componentes/NavBar/Calendar/Caledar';
import axios from 'axios';
import ApiConnection from '../../Componentes/Api/ApiConfig';
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
    <div className="container title py-5 mt-4">
      <div className="col-md-12 mb-3">
        <div className="d-flex align-items-center p-3 bg-white shadow rounded">
          <div className="d-flex justify-content-center align-items-center bg-primary text-white fs-2 rounded-circle me-3" style={{ width: '64px', height: '64px' }}>
            <i className="fa-solid fa-user-tie"></i>
          </div>
          <div>
            <span className="d-block fs-4 fw-bold">Administrador</span>
            <span className="d-block text-muted">Estetica Principal Emma</span>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        {/* Chart Card */}
        <div className="col-md-12 col-lg-8 mb-3">
          <div className="bg-white shadow rounded-lg">
            <div className="p-4 border-bottom">
              <strong>Calendario de citas agendadas</strong>
            </div>
            <div className="p-4 d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <div className="text-muted text-center">
                <div className="d-flex justify-content-center align-items-center h-100 border border-secondary border-dashed rounded">
                  <CalendarComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-4 mb-4">
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center p-3 bg-white mb-4 shadow rounded">
              <div className="d-flex justify-content-center align-items-center bg-success text-white fs-4 rounded-circle me-3" style={{ width: '64px', height: '64px' }}>
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <span className="d-block fs-4 fw-bold">{stats.citas.atendidas}</span>
                <span className="d-block text-muted">Citas atendidas</span>
              </div>
            </div>
            <div className="d-flex align-items-center p-3 mb-4 bg-white shadow rounded">
              <div className="d-flex justify-content-center align-items-center bg-success text-white fs-4 rounded-circle me-3" style={{ width: '64px', height: '64px' }}>
                <i className="fas fa-calendar-day"></i>
              </div>
              <div className='btn btn-link text-reset text-decoration-none fw-bold btn-hover' onClick={() => navigation('/admin/admin/citas-list')}>
                <span className="d-block fs-4 fw-bold">{stats.citas.confirmadas}</span>
                <span className="d-block text-muted">Citas agendadas para esta semana</span>
              </div>
            </div>
            <div className="d-flex align-items-center p-3 mb-4 bg-white shadow rounded">
              <div className="d-flex justify-content-center align-items-center bg-warning text-white fs-4 rounded-circle me-3" style={{ width: '64px', height: '64px' }}>
                <i className="fa-solid fa-hourglass-half"></i>
              </div>
              <div className='btn btn-link text-reset text-decoration-none fw-bold btn-hover' onClick={() => navigation('/admin/admin/citas-list?filter=pendiente')}>
                <span className="d-block fs-4 fw-bold">{stats.citas.pendientes}</span>
                <span className="d-block text-muted">Citas pendientes por confirmar</span>
                <span className="d-block text-muted"></span>
              </div>
            </div>
          </div>
        </div>
        <h4 className='fw-bold'>Ingresos totales</h4>
        <div className="col-md-6 col-lg-4 mb-3">
          <div className="d-flex align-items-center p-3 bg-white shadow rounded">
            <div className="d-flex justify-content-center align-items-center bg-secondary text-white rounded-circle me-3" style={{ width: '64px', height: '64px' }}>
              <i className="fas fa-pie-chart h-4 w-4"></i>
            </div>
            <div>
              <span className="d-block fs-4 fw-bold">$ {stats.ventas.total}</span>
              <span className="d-block text-muted">Ingresos por ventas realizadas</span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-3">
          <div className="d-flex align-items-center p-3 bg-white shadow rounded">
            <div className="d-flex justify-content-center align-items-center bg-secondary text-white rounded-circle me-3" style={{ width: '64px', height: '64px' }}>
              <i className="fas fa-pie-chart h-4 w-4"></i>
            </div>
            <div>
              <span className="d-block fs-4 fw-bold">$ {stats.citas.total}</span>
              <span className="d-block text-muted">Ingresos por citas realizadas</span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-3">
          <div className="d-flex align-items-center p-3 bg-white shadow rounded">
            <div className="d-flex justify-content-center align-items-center bg-danger text-white fs-4 rounded-circle me-3" style={{ width: '64px', height: '64px' }}>
              <i className="fa-solid fa-ban h-4 w-4"></i>
            </div>
            <div className='btn btn-link text-reset text-decoration-none fw-bold btn-hover' onClick={() => navigation('/admin/admin/citas-list?filter=Cancelada')}>
              <span className="d-block fs-4 fw-bold">{stats.citas.canceladas}</span>
              <span className="d-block text-muted fs-6">Citas canceladas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin;
