// const { dbAll, dbRun } = require("../common/dbExecute");

const updateKOT = (db2, { id }) => {
      try {
            db2.prepare("UPDATE KOT SET KOT_status = 'food is ready' WHERE id=? ").run([id]);
            // dbRun(db, "UPDATE KOT SET KOT_status = 'food is ready' WHERE id=? ", [id]);
      } catch (err) {
            console.log(err);
      }
};

module.exports = { updateKOT };
