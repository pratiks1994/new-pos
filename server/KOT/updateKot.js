const { dbAll, dbRun } = require("../common/dbExecute");

const updateKOT = async (db, { id }) => {
      dbRun(db, "UPDATE KOT SET KOT_status = 'food is ready' WHERE id=? ", [id]);
};

module.exports = { updateKOT };
