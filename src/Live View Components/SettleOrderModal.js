import React, { useState } from "react";
import styles from "./SettleOrderModal.module.css";
import { Modal, Button, Row, Col } from "react-bootstrap";

function SettleOrderModal({ show, hide, order, orderMutation, isLoading }) {
      const [paymentDetail, setPaymentDetail] = useState({ paymentType: "", customerPaid: "", customerReturn: "", tip: "", settleAmount: "" });

      const handleChange = (e) => {
            const { name, value } = e.target;

            if (name === "customerPaid") {
                  setPaymentDetail((prev) => {
                        const returnAmount = Math.round(value - order.total);
                        const customerReturn = returnAmount < 0 ? "Amount is less" : `₹ ${returnAmount}`
                        return { ...prev, [name]: value, customerReturn: customerReturn };
                  });
                // setPaymentDetail((prev) => ({ ...prev, [name]: value }));
            } else {
                  setPaymentDetail((prev) => ({ ...prev, [name]: value }));
            }
      };

      const handleSettle = async () => {
            await orderMutation({
                  orderStatus: order.order_status,
                  orderId: order.id,
                  orderType: order.order_type,
                  KOTId: order.KOTDetail.id,
                  print_count: order.print_count,
                  paymentType: paymentDetail.paymentType,
                  customerPaid: paymentDetail.customerPaid,
                  tip: paymentDetail.tip,
                  settleAmount: paymentDetail.settleAmount,
            });

            hide();
      };

      return (
            <Modal show={show} onHide={hide} size="md" aria-labelledby="contained-modal-title-vcenter" centered animation={false}>
                  <Modal.Header closeButton className={styles.settleModalHeader}>
                        Save & Settle for - {order.dine_in_table_no} [ ₹ {order.total}]
                  </Modal.Header>
                  <Modal.Body className={styles.settleModalBody}>
                        <Row>
                              <Col>Payment Type</Col>
                        </Row>
                        <Row>
                              <Col className={styles.paymentOptions}>
                                    <div className={styles.option}>
                                          <input type="radio" name="paymentType" id="cash" value="cash" onChange={handleChange} checked={paymentDetail.paymentType === "cash"} />
                                          <label htmlFor="cash">Cash</label>
                                    </div>
                                    <div className={styles.option}>
                                          <input type="radio" name="paymentType" id="card" value="card" onChange={handleChange} checked={paymentDetail.paymentType === "card"} />
                                          <label htmlFor="card">Card</label>
                                    </div>
                                    <div className={styles.option}>
                                          <input type="radio" name="paymentType" id="due" value="due" onChange={handleChange} checked={paymentDetail.paymentType === "due"} />
                                          <label htmlFor="due">Due</label>
                                    </div>
                                    <div className={styles.option}>
                                          <input type="radio" name="paymentType" id="other" value="other" onChange={handleChange} checked={paymentDetail.paymentType === "other"} />
                                          <label htmlFor="other">Other</label>
                                    </div>
                                    <div className={styles.option}>
                                          <input type="radio" name="paymentType" id="part" value="part" onChange={handleChange} checked={paymentDetail.paymentType === "part"} />
                                          <label htmlFor="part">Part</label>
                                    </div>
                              </Col>
                        </Row>
                        <Row className={styles.field}>
                              <Col xs={5}>Customer paid</Col>
                              <Col xs={7}>
                                    <input type="number" name="customerPaid" onChange={handleChange} value={paymentDetail.customerPaid} />
                              </Col>
                        </Row>
                        <Row className={styles.field}>
                              <Col xs={5}>Return to customer</Col>
                              <Col xs={7}>
                                    <input type="text" disabled name="customerReturn" value={paymentDetail.customerReturn} className={styles.returnAmount} />
                              </Col>
                        </Row>
                        <Row className={styles.field}>
                              <Col xs={5}>Tip </Col>
                              <Col xs={7}>
                                    <input type="number" name="tip" onChange={handleChange} value={paymentDetail.tip} />
                              </Col>
                        </Row>
                        <Row className={styles.field}>
                              <Col xs={5}>Settle Amount</Col>
                              <Col xs={7}>
                                    <input type="number" name="settleAmount" onChange={handleChange} value={paymentDetail.settleAmount} />
                              </Col>
                        </Row>
                  </Modal.Body>
                  <Modal.Footer className={styles.footer}>
                        <button className={styles.saveBtn} onClick={handleSettle} disabled={isLoading}>
                              {" "}
                              Save & Settle
                        </button>
                        <button className={styles.cancelBtn} onClick={hide}>
                              Close
                        </button>
                  </Modal.Footer>
            </Modal>
      );
}

export default SettleOrderModal;
