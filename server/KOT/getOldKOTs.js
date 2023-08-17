// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb")
const db2 = getDb()

const getOldKOTs = (tableNO) => {

      const allKOTItems = []
      
      const liveKOTs = db2.prepare("SELECT id FROM kot WHERE order_type='dine_in' AND table_no=? AND order_id IS NULL  ").all([tableNO]);
      // const liveKOTs = await dbAll(db, "SELECT * FROM KOT WHERE KOT_status = 'accepted'", []);

      const prepareKOTItem = db2.prepare("SELECT * FROM kot_items WHERE kot_id = ?");
      // const prepareAddon = db2.prepare("SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?");

      const liveKOTsWithItems = liveKOTs.map((KOT) => {
            const KOTItems = prepareKOTItem.all([KOT.id]);
            // const KOTItems = await dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOT.id]);

            const itemsWithAddons = KOTItems.map((item) => {
                  // const itemAddons = prepareAddon.all([item.id]);
                  // const itemAddons = await dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?", [item.id]);

                  return { ...item, item_addons: JSON.parse(item.item_addons), item_tax: JSON.parse(item.item_tax) };
            });

            allKOTItems.push(...itemsWithAddons)

            // return { ...KOT, items: itemsWithAddons };

      });

      return allKOTItems
};

module.exports = {getOldKOTs}