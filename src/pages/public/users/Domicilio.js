import React, { useEffect, useState } from 'react';
import ApiConnection from '../../../Components/Api/ApiConfig';
import { useAuth } from '../../../Components/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const DomicilioUser = ({correo}) => {
  const URLConnection = ApiConnection();
  const { token } = useAuth();
  const navigation = useNavigate();
  const data = jwtDecode(token);
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

    const request = direccionExistente
      ? axios.put(`${URLConnection}/address/${idUser}/${correo}`, direccionData)
      : axios.post(`${URLConnection}/address/${idUser}`, direccionData);

    request
      .then(response => {
        toast.success('Dirección guardada correctamente');
        setEditando(false);
        setDireccionExistente(true);
      })
      .catch(error => {
        toast.error('Error al guardar la dirección');
      });
  };

  return (
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => navigation(-1)}
            >
              <i className="fas fa-arrow-left mr-2"></i>Volver
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Domicilio del Usuario</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="municipio" className="block text-gray-700 font-medium">Municipio</label>
                  <input
                    type="text"
                    id="municipio"
                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 disabled:bg-gray-100"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    required
                    disabled={!editando}
                  />
                </div>
                <div>
                  <label htmlFor="cp" className="block text-gray-700 font-medium">Código Postal</label>
                  <input
                    type="text"
                    id="cp"
                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 disabled:bg-gray-100"
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                    required
                    disabled={!editando}
                  />
                </div>
                <div>
                  <label htmlFor="colonia" className="block text-gray-700 font-medium">Colonia</label>
                  <input
                    type="text"
                    id="colonia"
                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 disabled:bg-gray-100"
                    value={colonia}
                    onChange={(e) => setColonia(e.target.value)}
                    required
                    disabled={!editando}
                  />
                </div>
                <div>
                  <label htmlFor="calle" className="block text-gray-700 font-medium">Calle</label>
                  <input
                    type="text"
                    id="calle"
                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 disabled:bg-gray-100"
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    required
                    disabled={!editando}
                  />
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                {!editando ? (
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
                    onClick={handleEditar}
                  >
                    Editar
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-400 text-white font-medium rounded-md hover:bg-gray-500"
                      onClick={handleCancelar}
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
  );
};

export default DomicilioUser;
