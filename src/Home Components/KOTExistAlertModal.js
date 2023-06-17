import React from "react";
import styles from "./KOTExistAlertModal.module.css";
import { Modal, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { resetFinalOrder } from "../Redux/finalOrderSlice";
import { useMutation } from "react-query";

function KOTExistAlertModal({ show, hide, IPAddress, finalOrder, notify }) {
      const dispatch = useDispatch();

      const handleConfirm = async (finalOrder) => {
            let { data } = await axios.post(`http://${IPAddress}:3001/includeKOTsAndCreateOrder`, finalOrder);
            return data;
      };

      const { mutate, isLoading } = useMutation({
            mutationKey: "includeKOTsAndCreateOrder",
            mutationFn: handleConfirm,
            onSuccess: (data) => {
                  hide();
                  dispatch(resetFinalOrder());
                  notify("success", "Orders and KOT updated");
            },
      });

      return (
            <Modal show={show} onHide={hide} backdrop="static" centered animation={false}>
                  <Modal.Body className={styles.modalBody}>
                        <Row>
                              <Col className={styles.message}>There are some older KOTs exist in mentioned table do you want to merge into current order</Col>
                        </Row>
                        <Row>
                              <Col className={styles.modalControl}>
                                    <button className={styles.okBtn} onClick={() => mutate(finalOrder)} disabled={isLoading}>
                                          {isLoading ? "Loading" : "OK"}
                                    </button>
                                    <button className={styles.cancelBtn} onClick={hide}>
                                          Cancel
                                    </button>
                              </Col>
                        </Row>
                  </Modal.Body>
            </Modal>
      );
}

export default KOTExistAlertModal;
