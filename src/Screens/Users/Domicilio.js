import React, { useEffect, useState } from 'react';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { useAuth } from '../../Componentes/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';
const DomicilioUser = () => {
  const URLConnection = ApiConnection();
  const { token } = useAuth();
  const data = jwtDecode(token);
  const idUser = data.user.idUser;
  const [municipio, setMunicipio] = useState('');
  const [cp, setCp] = useState('');
  const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [editando, setEditando] = useState(false);

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
        if (!municipio) setMunicipio(address.municipality);
        if (!cp) setCp(address.cp);
        if (!colonia) setColonia(address.cologne);
        if (!calle) setCalle(address.street);

      })
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enviar la solicitud a la API para actualizar los datos del usuario
    axios.put(`${URLConnection}/address/${idUser}/${data.user.email}`, {
      municipality: municipio,
        cologne: colonia,
        street: calle,
        cp: cp,
    })
    .then(response => {
        //console.log('Datos actualizados correctamente:', response.data);
        toast.success('Datos actualizados correctamente', {
            position: 'top-right',
            className: 'mt-5'
        });
        setEditando(false);
    })
    .catch(error => {
        toast.error('Error al actualizar los datos del usuario')
        //console.log('Error al actualizar los datos del usuario:', error);
    });
};

  return (
    <div className='mt-4'>
      <div className='row'>
        <div className='col-md-3'></div>
        <div className='col-md-8 formulario'>
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
            <div className='d-flex justify-content-center mt-2'>
              {!editando && (
                <button type='button' className='btn btn-success me-2 fs-5' onClick={handleEditar}>
                  Editar
                </button>
              )}
              {editando && (
                <>
                  <button type='submit' className='btn btn-primary me-2 fs-5'>
                    Guardar
                  </button>
                  <button type='button' className='btn btn-secondary fs-5' onClick={handleCancelar}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DomicilioUser;
