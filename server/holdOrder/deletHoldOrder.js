const { dbAll, dbRun } = require("../common/dbExecute");

const deletHoldOrder = async (db, id) => {
      dbRun(db, "DELETE FROM hold_orders WHERE id=?", [id]);
};

module.exports = { deletHoldOrder };
