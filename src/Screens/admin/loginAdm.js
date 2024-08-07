import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../Componentes/Context/AdminAuthContext';

const URLConnection = ApiConnection();

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { setAdminAuthToken } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post(`${URLConnection}/users/loginAdmin`, {
      email: credentials.email,
      password: credentials.password
    })
      .then(response => {
        const data = response.data.data;
        if (response.data.success) {
          setAdminAuthToken(data);
          toast.success(`Inicio exitoso`, {
            position: "top-right",
            className: "mt-5"
          });
          navigation('/admin/admin/dashboard');
        } else {
          const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
          toast.error('Ingreso fallido. ' + errorMessage);
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            toast.warn(error.response.data.message, {
              position: 'top-right',
              className: 'mt-5'
            });
          } else if (error.response.status === 403) {
            toast.error(error.response.data.message, {
              position: 'top-right',
              className: 'mt-5'
            });
          }
        } else {
          if (error.message.toLowerCase() === 'network error') {
            alert('Error de red. Por favor, verifica tu conexión a Internet.', error.message);
          } else {
            console.log('Error:', error.message);
            toast.error('Error inesperado. Por favor, inténtalo de nuevo más tarde.');
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Login Administrador</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Usuario</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                </div>
                <div className='form-group mb-2'>
                  <label htmlFor='password' className='form-label fw-bold'>
                    Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      id='password'
                      className={`form-control`}
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={credentials.password}
                      onChange={handleChange}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
                <button type='submit' className={`btn btn-success mt-2 ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? (
                    <div className="progress-container">
                      <i className="fa-solid fa-spinner"></i>  Ingresando...
                      <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}></div>
                    </div>
                  ) : (
                    <>
                      <i className="fa-solid fa-right-to-bracket me-3"></i>
                      Iniciar sesión
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
