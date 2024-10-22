import React, { useEffect, useState } from 'react';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { useAuth } from '../../Componentes/Context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';

const DomicilioUser = () => {
  const correo = useParams()
  const URLConnection = ApiConnection();
  const { token } = useAuth();
  const navigation = useNavigate()
  const data = jwtDecode(token);
  console.log(correo)
  const idUser = data.user.idUser;
  const [municipio, setMunicipio] = useState('');
  const [cp, setCp] = useState('');
  const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [editando, setEditando] = useState(false);
  const [direccionExistente, setDireccionExistente] = useState(false);

  const handleEditar = () => {
    setEditando(true);
  };

  const handleCancelar = () => {
    setEditando(false);
  };

  useEffect(() => {
    axios.get(`${URLConnection}/address/${idUser}`)
      .then(res => {
        const address = res.data;
        if (address) {
          setMunicipio(address.municipality || '');
          setCp(address.cp || '');
          setColonia(address.cologne || '');
          setCalle(address.street || '');
          setDireccionExistente(true);
        } else {
          setDireccionExistente(false);
        }
      })
      .catch(error => {
        console.error('Error al obtener la dirección del usuario:', error);
        toast.error('Error al obtener la dirección del usuario');
      });
  }, [URLConnection, idUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const direccionData = {
      municipality: municipio,
      cologne: colonia,
      street: calle,
      cp: cp,
    };

    if (direccionExistente) {
      axios.put(`${URLConnection}/address/${idUser}/${correo}`, direccionData)
        .then(response => {
          toast.success('Datos actualizados correctamente', {
            position: 'top-right',
            className: 'mt-5'
          });
          setEditando(false);
        })
        .catch(error => {
          toast.error('Error al actualizar los datos del usuario');
        });
    } else {
      axios.post(`${URLConnection}/address/${idUser}`, direccionData)
        .then(response => {
          toast.success('Dirección agregada correctamente', {
            position: 'top-right',
            className: 'mt-5'
          });
          setDireccionExistente(true);
          setEditando(false);
        })
        .catch(error => {
          toast.error('Error al agregar la dirección del usuario');
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-10">
          <div className="card shadow-lg border-0 rounded-lg">
          <div className='col-12 text-left mt-2'>
                    <i className='fa-solid fa-arrow-left' />
                    <button className='btn btn-link text-reset text-decoration-none fw-bold btn-hover' onClick={() => navigation(-1)}>Volver</button>
                </div>
            <div className="card-header title text-center">
              <h2>Domicilio del Usuario</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="municipio" className="form-label">Municipio</label>
                  <input
                    type="text"
                    className="form-control"
                    id="municipio"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    required
                    disabled={!editando}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cp" className="form-label">Código Postal</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cp"
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                    required
                    disabled={!editando}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="colonia" className="form-label">Colonia</label>
                  <input
                    type="text"
                    className="form-control"
                    id="colonia"
                    value={colonia}
                    onChange={(e) => setColonia(e.target.value)}
                    required
                    disabled={!editando}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="calle" className="form-label">Calle</label>
                  <input
                    type="text"
                    className="form-control"
                    id="calle"
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    required
                    disabled={!editando}
                  />
                </div>
                <div className="d-flex justify-content-center mt-4">
                  {!editando && (
                    <button type="button" className="btn btn-success me-2 fs-5" onClick={handleEditar}>
                      Editar
                    </button>
                  )}
                  {editando && (
                    <>
                      <button type="submit" className="btn btn-primary me-2 fs-5">
                        Guardar
                      </button>
                      <button type="button" className="btn btn-secondary fs-5" onClick={handleCancelar}>
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomicilioUser;
