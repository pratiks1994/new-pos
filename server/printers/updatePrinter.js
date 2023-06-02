const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const updatePrinter = (data) => {
      db2.prepare("UPDATE printers SET printer_name=?, printer_display_name=? where id=?").run([data.selectedPrinter, data.printer_display_name, data.id]);

      console.log(data);
};

module.exports = { updatePrinter };
