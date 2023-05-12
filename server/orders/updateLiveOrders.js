const { dbAll, dbRun } = require("../common/dbExecute");

const updateLiveOrders = async (db, data) => {

    let {updatedStatus,orderId} = data
    dbRun(db,"UPDATE orders SET order_status=? WHERE id=?",[updatedStatus,orderId])
    
};

module.exports = { updateLiveOrders };
