const { dbAll, dbRun } = require("../common/dbExecute");

// dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOTs.id])
// dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?",[KOTItems.id])

const getLiveOrders = async (db) => {
      const liveOrders = await dbAll(
            db,
            "SELECT id,order_number,customer_name,complete_address,phone_number,order_type,dine_in_table_no,description,item_total,total_discount,total_tax,delivery_charges,total,payment_type,order_status,created_at FROM orders WHERE NOT order_status = 'settled'",
            []
      );

      const liveOrdersWithItems = Promise.all(
            liveOrders.map(async (order) => {
                  const orderItems = await dbAll(db, "SELECT id,item_id,item_name,price,final_price,quantity,variation_name,variation_id FROM order_items WHERE order_id = ?", [order.id]);

                  const itemsWithAddons = await Promise.all(
                        orderItems.map(async (item) => {
                              const itemAddons = await dbAll(db, "SELECT addongroupitem_id,name,price,quantity FROM order_item_addongroupitems WHERE order_item_id = ?", [item.id]);
                              const itemTax = await dbAll(db,"SELECT tax_id,tax_amount FROM order_item_taxes WHERE order_item_id = ?",[item.id])
                              return { ...item, itemAddons, itemTax };
                        })
                  );

                  return { ...order, items: itemsWithAddons };
            })
      );

      return liveOrdersWithItems;
};

module.exports = { getLiveOrders };

