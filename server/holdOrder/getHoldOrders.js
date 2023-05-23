const { dbAll, dbRun } = require("../common/dbExecute");

const getHoldOrders = async (db) => {
      const holdOrders = await dbAll(db, "SELECT * FROM hold_orders", []);

      const holdOrdersWithItems = Promise.all(
            holdOrders.map(async (order) => {
                  const holdOrderItems = await dbAll(db, "SELECT * FROM hold_order_items  WHERE Hold_order_id = ?", [order.id]);

                  const itemsWithAddons = await Promise.all(
                        holdOrderItems.map(async (item) => {
                              const itemAddons = await dbAll(db, "SELECT * FROM hold_order_item_addongroupitems WHERE hold_order_item_id = ?", [item.id]);

                              return { ...item, toppings: itemAddons, itemTax: JSON.parse(item.itemTax) };
                        })
                  );

                  return { ...order, orderCart: itemsWithAddons };
            })
      );

      return holdOrdersWithItems;
};

module.exports = { getHoldOrders };
