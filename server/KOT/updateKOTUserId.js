
// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});
const { getDb } = require("../common/getDb")
const db2 = getDb()


const updateKOTUserId = (orderId,userId,tableNumber) =>{

    db2.prepare("UPDATE kot SET order_id=?, user_id=? WHERE order_type='dine_in' AND table_no=? AND order_id IS NULL").run([orderId,userId,tableNumber])

   

}

module.exports = { updateKOTUserId}