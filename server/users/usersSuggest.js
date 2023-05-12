const { dbAll, dbRun } = require("../common/dbExecute");

const getUserSuggest = async (db, data) => {
      let matches;

      if (data.customerContact) {
            matches = await dbAll(db, `SELECT id,name,number FROM users WHERE number LIKE "${data.customerContact}%" LIMIT 10`, []);
      } else {
            matches = await dbAll(db, `SELECT id,name,number FROM users WHERE name LIKE "${data.customerName}%" LIMIT 10`, []);
      }

      return await Promise.all(
            matches.map(async (match) => {
                  const addresses = await dbAll(db, "SELECT complete_address,landmark FROM user_addresses WHERE user_id=?", [match.id]);
                  return { ...match, addresses };
            })
      );
};

module.exports = { getUserSuggest };
