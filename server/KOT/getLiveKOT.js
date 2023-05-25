const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

// dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOTs.id])
// dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?",[KOTItems.id])

const getLiveKOT = async (db) => {
      const liveKOTs = db2.prepare("SELECT * FROM KOT WHERE KOT_status = 'accepted'").all([]);
      // const liveKOTs = await dbAll(db, "SELECT * FROM KOT WHERE KOT_status = 'accepted'", []);

      const liveKOTsWithItems = Promise.all(
            liveKOTs.map(async (KOT) => {
                  const KOTItems = db2.prepare("SELECT * FROM KOT_items WHERE KOT_id = ?").all([KOT.id]);
                  // const KOTItems = await dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOT.id]);

                  const itemsWithAddons = await Promise.all(
                        KOTItems.map(async (item) => {
                              const itemAddons = db2.prepare("SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?").all([item.id]);
                              // const itemAddons = await dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?", [item.id]);

                              return { ...item, itemAddons, itemTax: JSON.parse(item.itemTax) };
                        })
                  );

                  return { ...KOT, items: itemsWithAddons };
            })
      );

      return liveKOTsWithItems;
};

module.exports = { getLiveKOT };
