import React from "react";
import styles from "./FinalOrderItemModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function FinalOrderItemModal({ hideModal, show }) {
      return (
            <Modal show={show} onHide={hideModal} size="lg" aria-labelledby="contained-modal-title-vcenttyer" centered animation={false}>
                  <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Modal heading</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                        <h4>Centered Modal</h4>
                        <p>
                              Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur
                              ac, vestibulum at eros.
                        </p>
                  </Modal.Body>
                  <Modal.Footer>
                        <Button onClick={hideModal}>Close</Button>
                  </Modal.Footer>
            </Modal>
      );
}

export default FinalOrderItemModal;
