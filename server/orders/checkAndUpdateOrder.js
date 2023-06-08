const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const checkAndUpdateOrder = (order, db) => {
      // check if order with table id exist which is only accepted and not printed (if printed create new order and KOT )
      // if exist get order id
      // update order with new detail where id = order id , insert into item , addon , tax table
      // no KOT
      // return true
      // if does not exist return false
      let orderId = "";

      const matchOrder = db2
            .prepare("SELECT id FROM orders WHERE  order_type='Dine In' AND dine_in_table_no=? AND order_status = 'accepted' AND print_count= 0 AND settle_amount IS NULL")
            .get([order.tableNumber]);

      // const matchOrder = await dbAll(db, "SELECT id FROM orders WHERE dine_in_table_no=? AND order_status = 'accepted'", [order.tableNumber]);

      if (matchOrder?.id && order.orderType === "Dine In") {
            const { orderCart } = order;

            const matchOrderId = matchOrder.id;
            orderId = matchOrder.id;

            db2.prepare("UPDATE orders SET item_total = item_total + ? , total_discount = total_discount + ? , total_tax = total_tax + ? , total = total + ? WHERE id = ?").run([
                  order.subTotal,
                  order.discount,
                  order.tax,
                  order.cartTotal,
                  matchOrderId,
            ]);

            // dbRun(db, "UPDATE orders SET item_total = item_total + ? , total_discount = total_discount + ? , total_tax = total_tax + ? , total = total + ? WHERE id = ?", [
            //       order.subTotal,
            //       order.discount,
            //       order.tax,
            //       order.cartTotal,
            //       matchOrderId,
            // ]);

            db2.transaction(() => {
                  orderCart.forEach((item) => {
                        const { itemQty, itemId, itemName, variation_id, variantName, itemTotal, multiItemTotal, toppings, itemTax } = item;

                        const { lastInsertRowid: orderItemId } = db2
                              .prepare("INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity,variation_name,variation_id) VALUES (?,?,?,?,?,?,?,?)")
                              .run([matchOrderId, itemId, itemName, itemTotal, multiItemTotal, itemQty, variantName, variation_id]);

                        if (toppings.length !== 0) {
                              db2.transaction(() => {
                                    toppings.forEach((topping) => {
                                          const { id, type, price, qty } = topping;
                                          db2.prepare("INSERT INTO order_item_addongroupitems (order_item_id,addongroupitem_id,name,price,quantity) VALUES (?,?,?,?,?)").run([
                                                orderItemId,
                                                id,
                                                type,
                                                price,
                                                qty,
                                          ]);
                                    });
                              })();
                        }

                        db2.transaction(() => {
                              itemTax.forEach((tax) => {
                                    db2.prepare("INSERT INTO order_item_taxes (order_item_id,tax_id,tax,tax_amount) VALUES (?,?,?,?)").run([orderItemId, tax.id, 2.5, tax.tax]);
                              });
                        })();
                  });
            })();

            // orderCart.forEach(async (item) => {
            //       const { itemQty, itemId, itemName, variation_id, variantName, itemTotal, multiItemTotal, toppings, itemTax } = item;
            //       orderItemId = await dbRun(
            //             db,
            //             "INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity,variation_name,variation_id) VALUES (?,?,?,?,?,?,?,?)",
            //             [matchOrderId, itemId, itemName, itemTotal, multiItemTotal, itemQty, variantName, variation_id]
            //       );

            //       // if (toppings.length !== 0) {
            //       //       toppings.forEach(async (topping) => {
            //       //             const { id, type, price, qty } = topping;
            //       //             await dbRun(db, "INSERT INTO order_item_addongroupitems (order_item_id,addongroupitem_id,name,price,quantity) VALUES (?,?,?,?,?)", [
            //       //                   orderItemId,
            //       //                   id,
            //       //                   type,
            //       //                   price,
            //       //                   qty,
            //       //             ]);
            //       //       });
            //       // }

            //       // itemTax.forEach(async (tax) => {
            //       //       await dbRun(db, "INSERT INTO order_item_taxes (order_item_id,tax_id,tax,tax_amount) VALUES (?,?,?,?)", [orderItemId, tax.id, 2.5, tax.tax]);
            //       // });
            // });

            return orderId;
      } else {
            return orderId;
      }
};

module.exports = { checkAndUpdateOrder };
