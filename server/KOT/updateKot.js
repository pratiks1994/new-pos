// const { dbAll, dbRun } = require("../common/dbExecute");
const { updateLiveOrders } = require("../orders/updateLiveOrders");

const updateKOT = (db2, { id, order_id, order_type }) => {
      // console.log(order_id)
      try {
            db2.prepare("UPDATE kot SET kot_status = 'food_is_ready' WHERE id=? ").run([id]);
            // dbRun(db, "UPDATE KOT SET KOT_status = 'food is ready' WHERE id=? ", [id]);

            
      } catch (err) {
            console.log(err);
      }
};

module.exports = { updateKOT };
