const { dbAll, dbRun } = require("../common/dbExecute");

const updateKOT = async (db, { id }) => {
      try {
            dbRun(db, "UPDATE KOT SET KOT_status = 'food is ready' WHERE id=? ", [id]);
      } catch (err) {
            console.log(err)
      }
};

module.exports = { updateKOT };
