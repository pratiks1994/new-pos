// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});
const { getDb } = require("../common/getDb")
const db2 = getDb()


const getDefaultScreenData = () => {
	try {
		const options = db2.prepare("SELECT configuration FROM restaurants where id=?").get(1);
		return JSON.parse(options.configuration)
	} catch (err) {
		console.log(err);
        return "err"
	}
};

module.exports = { getDefaultScreenData };
