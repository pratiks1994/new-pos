const { dbAll, dbRun } = require("../common/dbExecute");

const       checkAndUpdateOrder = async (order, db) => {
      // check if order with table id exist which is only accepted and not printed (if printed create new order and KOT )
      // if exist get order id 
      // update order with new detail where id = order id , insert into item , addon , tax table
      // no KOT
      // return true
      // if does not exist return false

      const { orderCart } = order;

      const matchOrder = await dbAll(db, "SELECT id FROM orders WHERE dine_in_table_no=? AND order_status = 'accepted'", [order.tableNumber]);

      if (matchOrder.length !== 0 && order.orderType === "Dine In") {
            const matchOrderId = matchOrder[0]?.id;

            dbRun(db, "UPDATE orders SET item_total = item_total + ? , total_discount = total_discount + ? , total_tax = total_tax + ? , total = total + ? WHERE id = ?", [
                  order.subTotal,
                  order.discount,
                  order.tax,
                  order.cartTotal,
                  matchOrderId,
            ]);

            orderCart.forEach(async (item) => {
                  const { itemQty, itemId, itemName, variation_id, variantName, itemTotal, multiItemTotal, toppings, itemTax } = item;
                  orderItemId = await dbRun(db, "INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity,variation_name,variation_id) VALUES (?,?,?,?,?,?,?,?)", [
                        matchOrderId,
                        itemId,
                        itemName,
                        itemTotal,
                        multiItemTotal,
                        itemQty,
                        variantName,
                        variation_id,
                  ]);

                  if (toppings.length !== 0) {
                        toppings.forEach(async (topping) => {
                              const { id, type, price, qty } = topping;
                              await dbRun(db, "INSERT INTO order_item_addongroupitems (order_item_id,addongroupitem_id,name,price,quantity) VALUES (?,?,?,?,?)", [
                                    orderItemId,
                                    id,
                                    type,
                                    price,
                                    qty,
                              ]);
                        });
                  }

                  itemTax.forEach(async (tax) => {
                        await dbRun(db, "INSERT INTO order_item_taxes (order_item_id,tax_id,tax,tax_amount) VALUES (?,?,?,?)", [orderItemId, tax.id, 2.5, tax.tax]);
                  });
            });

            return true;
      } else {
            return false;
      }
};

module.exports = { checkAndUpdateOrder };
