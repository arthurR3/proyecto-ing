import React from 'react';

const Contact = () => {
  return (
    <div className="container mt-5">
      <h2 className="mb-2 mt-4 title">Contacto</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title title">Información de la Empresa</h4>
          <p> Cualquier duda o sugierencia, por favor de comunicarse a los siguientes medios:</p>
          <p className="card-text">
            <strong>Nombre:</strong> Estética Principal
          </p>
          <p className="card-text">
            <strong>Teléfono:</strong> +123 456 7890
          </p>
          <p className="card-text">
            <strong>Dirección:</strong>Velazquez Ibarra, Colonia Centro, Huejutla de Reyes, Hidalgo
          </p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title title">Dudas o Quejas</h4>
          <p className="card-text">
            Si tienes alguna duda o queja, por favor contáctanos a través del siguiente formulario.
          </p>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre</label>
              <input type="text" className="form-control" id="name" placeholder="Tu nombre" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input type="email" className="form-control" id="email" placeholder="tu@correo.com" />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Mensaje</label>
              <textarea className="form-control" id="message" rows="5" placeholder="Escribe tu mensaje aquí"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
