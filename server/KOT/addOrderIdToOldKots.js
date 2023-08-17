// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb")
const db2 = getDb()

const addOrderIdToOldKots = (orderId,tableNo) =>{
    

    db2.prepare("UPDATE kot SET order_id = ? WHERE order_type='dine_in' AND table_no=? AND order_id IS NULL").run([orderId,tableNo])


}

module.exports = { addOrderIdToOldKots}