const { default: axios } = require("axios");
const { getDb } = require("../common/getDb");
const { getOrderToSync } = require("../orders/getOrderToSync");
const { getKotToSync } = require("../KOT/getKotTosync");
const db2 = getDb();
const tokenData = db2.prepare("SELECT value FROM startup_config WHERE name = ?").get(["token"]);

async function syncKots() {
 getKotToSync()



	
}

module.exports = { syncKots };
