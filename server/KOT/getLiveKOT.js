const { dbAll, dbRun } = require("../common/dbExecute");

// dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOTs.id])
// dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?",[KOTItems.id])

const getLiveKOT = async (db) => {
      const liveKOTs = await dbAll(db, "SELECT * FROM KOT WHERE KOT_status = 'active'", []);

      const liveKOTsWithItems = Promise.all(
            liveKOTs.map(async (KOT) => {
                  const KOTItems = await dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOT.id]);

                  const itemsWithAddons = await Promise.all(
                        KOTItems.map(async (item) => {
                              const itemAddons = await dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?", [item.id]);
                              return { ...item, itemAddons };
                        })
                  );

                  return { ...KOT, items:itemsWithAddons };
            })
      );

      return liveKOTsWithItems
};

module.exports = { getLiveKOT };
