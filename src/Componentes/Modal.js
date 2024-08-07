import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../CSS/Carrusel.css'

const CustomModal = ({ show, onHide, title, children }) => {
  return (
    <Modal className='modal-open' show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary"  className='btn btn-secondary' onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
