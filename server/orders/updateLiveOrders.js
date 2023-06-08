// const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const updateLiveOrders = (db, data) => {
      let { orderStatus, orderId, orderType, KOTId, print_count, tip, settleAmount, customerPaid, paymentType } = data;


      if (orderType === "Dine In") {
            try {
                  if (print_count === 0) {
                        db2.prepare("UPDATE orders SET print_count=? WHERE id=?").run([1, orderId]);
                  } else {
                        if (settleAmount !== "") {
                              db2.prepare("UPDATE orders SET settle_amount=? WHERE id=?").run([settleAmount, orderId]);
                        } else {
                              db2.prepare("UPDATE orders SET settle_amount=total WHERE id=?").run([orderId]);
                        }
                  }
            } catch (err) {
                  console.log(err);
            }
      } else {
            const statusMap = {
                  "Dine In": ["accepted", "printed", "settled"],
                  Delivery: ["accepted", "food_is_ready", "dispatched", "delivered"],
                  "Pick Up": ["accepted", "food_is_ready", "picked_up"],
            };

            const statuses = statusMap[orderType] || [];
            const current = statuses.findIndex((element) => element === orderStatus);
            updatedStatus = statuses[current + 1];

            // console.log(updatedStatus);

            try {
                  db2.prepare("UPDATE orders SET order_status=?, settle_amount=total WHERE id=?").run([updatedStatus, orderId]);

                  if (orderType !== "Dine In" && updatedStatus === "food_is_ready") {
                        db2.prepare("UPDATE KOT SET KOT_status=? WHERE id=?").run(["food is ready", KOTId]);
                  }

                  // dbRun(db,"UPDATE orders SET order_status=? WHERE id=?",[updatedStatus,orderId])
            } catch (err) {
                  console.log(err);
            }
      }
};

module.exports = { updateLiveOrders };
