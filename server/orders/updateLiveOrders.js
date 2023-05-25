const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const updateLiveOrders = async (db, data) => {
      let { updatedStatus, orderId } = data;

      try {
            db2.prepare("UPDATE orders SET order_status=? WHERE id=?").run([updatedStatus, orderId]);
            // dbRun(db,"UPDATE orders SET order_status=? WHERE id=?",[updatedStatus,orderId])
      } catch (err) {
            console.log(err);
      }
};

module.exports = { updateLiveOrders };
