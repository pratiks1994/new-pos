const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

// dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOTs.id])
// dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?",[KOTItems.id])

const getLiveOrders = (db) => {
      try {
            const liveOrders = db2
                  .prepare(
                        "SELECT id,order_number,customer_name,complete_address,phone_number,order_type,dine_in_table_no,description,item_total,total_discount,total_tax,delivery_charges,total,payment_type,order_status,created_at FROM orders WHERE NOT order_status = 'settled'"
                  )
                  .all([]);
            // const liveOrders = await dbAll(
            //       db,
            //       "SELECT id,order_number,customer_name,complete_address,phone_number,order_type,dine_in_table_no,description,item_total,total_discount,total_tax,delivery_charges,total,payment_type,order_status,created_at FROM orders WHERE NOT order_status = 'settled'",
            //       []
            // );

            const prepareItem = db2.prepare("SELECT id,item_id,item_name,price,final_price,quantity,variation_name,variation_id FROM order_items WHERE order_id = ?");
            const prepareToppings = db2.prepare("SELECT addongroupitem_id,name,price,quantity FROM order_item_addongroupitems WHERE order_item_id = ?");
            const prepareTax = db2.prepare("SELECT tax_id,tax_amount FROM order_item_taxes WHERE order_item_id = ?");

            const liveOrdersWithItems = liveOrders.map((order) => {
                  const orderItems = prepareItem.all([order.id]);

                  // const orderItems = await dbAll(
                  //       db,
                  //       "SELECT id,item_id,item_name,price,final_price,quantity,variation_name,variation_id FROM order_items WHERE order_id = ?",
                  //       [order.id]
                  // );

                  const itemsWithAddons = orderItems.map((item) => {
                        const itemAddons = prepareToppings.all([item.id]);

                        // const itemAddons = await dbAll(db, "SELECT addongroupitem_id,name,price,quantity FROM order_item_addongroupitems WHERE order_item_id = ?", [
                        //       item.id,
                        // ]);

                        const itemTax = prepareTax.all([item.id]);
                        // const itemTax = await dbAll(db, "SELECT tax_id,tax_amount FROM order_item_taxes WHERE order_item_id = ?", [item.id]);

                        return { ...item, itemAddons, itemTax };
                  });

                  return { ...order, items: itemsWithAddons };
            });

            return liveOrdersWithItems;
      } catch (err) {
            console.log(err);
      }
};

module.exports = { getLiveOrders };
