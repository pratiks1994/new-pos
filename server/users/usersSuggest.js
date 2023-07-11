const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const getUserSuggest = (db, data) => {
	let matches;

	if (data.customerContact) {
		matches = db2.prepare(`SELECT id, name, number FROM users WHERE number LIKE $number || '%' LIMIT 10`).all({
			number: data.customerContact,
		});
		// matches = db2.prepare(`SELECT id,name,number FROM users WHERE number LIKE "${data.customerContact}%" LIMIT 10`).all();
		// matches = await dbAll(db, `SELECT id,name,number FROM users WHERE number LIKE "${data.customerContact}%" LIMIT 10`, []);
	} else {
		matches = db2.prepare(`SELECT id, name, number FROM users WHERE name LIKE $name || '%' LIMIT 10`).all({
			name: data.customerName,
		});
		// matches = await dbAll(db, `SELECT id,name,number FROM users WHERE name LIKE "${data.customerName}%" LIMIT 10`, []);
	}

	for (const match of matches) {
		match.addresses = db2.prepare("SELECT complete_address,landmark FROM user_addresses WHERE user_id=?").all(match.id);
	}
	return matches;

	// return await Promise.all(
	//       matches.map(async (match) => {
	//             const addresses = await dbAll(db, "SELECT complete_address,landmark FROM user_addresses WHERE user_id=?", [match.id]);
	//             return { ...match, addresses };
	//       })
	// );
};

module.exports = { getUserSuggest };
