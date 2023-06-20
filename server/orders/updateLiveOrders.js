// const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const updateLiveOrders = (db, data) => {
      let { orderStatus, orderId, orderType, KOTId, print_count, tip, settleAmount, customerPaid, paymentType, multipay } = data;

      if (orderType === "dine_in") {
            try {
                  if (print_count === 0) {
                        db2.prepare("UPDATE orders SET print_count=? WHERE id=?").run([1, orderId]);
                  } else {
                        db2.transaction(() => {
                              const updateOrderStatement = db2.prepare(
                                    `UPDATE orders SET settle_amount = ${settleAmount !== "" ? settleAmount : "total"},
                                 user_paid = ${customerPaid !== "" ? customerPaid : "total"},
                                 tip = ${tip !== "" ? tip : 0},
                                 payment_type = ?
                                 WHERE id = ?`
                              );

                              updateOrderStatement.run([paymentType, orderId]);

                              if (paymentType === "multipay") {
                                    const multipayPrepare = db2.prepare("INSERT INTO multipays (order_id, payment_type, amount) VALUES (?, ?, ?)");

                                    multipay.forEach((partPay) => {
                                          if ((+partPay.amount)) {
                                                multipayPrepare.run([orderId, partPay.name, partPay.amount]);
                                              }
                                    });
                              }
                        })();
                  }
            } catch (err) {
                  console.log(err);
            }
      } else {
            const statusMap = {
                  // "dine_in": ["accepted", "printed", "settled"],
                  delivery: ["accepted", "food_is_ready", "dispatched", "delivered"],
                  pick_up: ["accepted", "food_is_ready", "picked_up"],
            };

            const statuses = statusMap[orderType] || [];
            const current = statuses.findIndex((element) => element === orderStatus);
            updatedStatus = statuses[current + 1];

            // console.log(updatedStatus);

            try {
                  db2.prepare("UPDATE orders SET order_status=?, settle_amount=total,user_paid=total WHERE id=?").run([updatedStatus, orderId]);

                  if (orderType !== "dine_in" && updatedStatus === "food_is_ready") {
                        db2.prepare("UPDATE kot SET kot_status=? WHERE id=?").run(["food_is_ready", KOTId]);
                  }

                  // dbRun(db,"UPDATE orders SET order_status=? WHERE id=?",[updatedStatus,orderId])
            } catch (err) {
                  console.log(err);
            }
      }
};

module.exports = { updateLiveOrders };
