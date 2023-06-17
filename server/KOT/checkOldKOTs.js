const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const checkOldKOTs = (table_number) => {
      const oldKOTs = db2.prepare("SELECT id FROM kot WHERE order_type='dine_in' AND table_no=? AND  order_id IS NULL").all([table_number]);

      console.log("old KOTS", oldKOTs);

      return oldKOTs.length === 0 ? false : true;
};

module.exports = { checkOldKOTs };
