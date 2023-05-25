const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const updateKOT = async (db, { id }) => {
      try {
            db2.prepare("UPDATE KOT SET KOT_status = 'food is ready' WHERE id=? ").run([id]);
            // dbRun(db, "UPDATE KOT SET KOT_status = 'food is ready' WHERE id=? ", [id]);
      } catch (err) {
            console.log(err);
      }
};

module.exports = { updateKOT };
