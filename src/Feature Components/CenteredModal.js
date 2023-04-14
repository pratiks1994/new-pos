import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./CenteredModal.module.css";

function CenteredModal({ show, onHide, name, body, handleSave, handleCancel,err,total}) {
   return ( 
      <Modal
         show={show}
         onHide={onHide}
         size="xl"
         aria-labelledby="contained-modal-title-vcenter"
         centered
         dialogClassName="modal-90w"
         animation={false}
         backdrop="static"
         className={styles.modal}
        
      >
         <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title id="contained-modal-title-vcenter" className={styles.modalTitle}>
               {name}
            </Modal.Title>
         </Modal.Header>
         <Modal.Body className={styles.modalBody}>{body}</Modal.Body>
         <Modal.Footer className={styles.modalFooter}>
            {err && <div className="text-danger">{err}</div>}
            <div className={styles.total}>Total : ₹ {total}</div>
            <Button variant="danger" onClick={handleCancel}>
               Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
         </Modal.Footer>
      </Modal>
   );
}

export default CenteredModal;
