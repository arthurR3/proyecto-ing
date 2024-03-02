import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ProductModal = ({ showModal, closeModal, selectedProduct }) => {
  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedProduct?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{selectedProduct?.description}</p>
        <p>Precio : {selectedProduct?.price}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductModal;
