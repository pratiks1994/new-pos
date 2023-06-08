const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

// dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOTs.id])
// dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?",[KOTItems.id])

const getLiveKOT = () => {
      const liveKOTs = db2.prepare("SELECT * FROM KOT WHERE KOT_status = 'accepted'").all([]);
      // const liveKOTs = await dbAll(db, "SELECT * FROM KOT WHERE KOT_status = 'accepted'", []);

      const prepareKOTItem = db2.prepare("SELECT * FROM KOT_items WHERE KOT_id = ?");
      // const prepareAddon = db2.prepare("SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?");

      const liveKOTsWithItems = liveKOTs.map((KOT) => {
            const KOTItems = prepareKOTItem.all([KOT.id]);
            // const KOTItems = await dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOT.id]);

            const itemsWithAddons = KOTItems.map((item) => {
                  // const itemAddons = prepareAddon.all([item.id]);
                  // const itemAddons = await dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?", [item.id]);

                  return { ...item, itemAddons:JSON.parse(item.itemAddons), itemTax: JSON.parse(item.itemTax) };
            });

            return { ...KOT, items: itemsWithAddons };
      });

      return liveKOTsWithItems;
};

module.exports = { getLiveKOT };
