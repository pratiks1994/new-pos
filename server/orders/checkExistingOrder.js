const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const checkExistingOrder = (KOT) => {
      if (KOT.orderType === "dine_in") {
            orderId = db2.prepare("SELECT id FROM orders WHERE order_type=? AND print_count=? AND dine_in_table_no=?").get(["dine_in", 0, KOT.tableNumber]);
            console.log(orderId);
            if (orderId) {
                  return true;
            } else {
                  return false;
            }
      } else {
            return false;
      }
};

module.exports = { checkExistingOrder };
