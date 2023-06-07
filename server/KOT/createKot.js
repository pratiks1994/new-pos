const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const createKot = (order, db, userId, orderId) => {
      let restaurantId = 1;
      let tokenNo;
      const {
            customerName,
            customerContact,
            customerAdd,
            customerLocality,
            deliveryCharge,
            packagingCharge,
            discount,
            paymentMethod,
            orderType,
            orderComment,
            cartTotal,
            tax,
            subTotal,
            tableNumber,
            orderCart,
      } = order;

      // create token comparing date of last date and current kot date , reset token no if the date is changed

      db2.transaction(() => {
            const { created_at, token_no } = db2.prepare("SELECT created_at,token_no FROM KOT ORDER BY ID DESC LIMIT 1").get([]);
            const currentDate = new Date().getDate();
            const lastKOTDate = new Date(created_at).getDate();

            if (currentDate !== lastKOTDate || !lastKOTDate) {
                  tokenNo = 1;
            } else {
                  tokenNo = token_no + 1;
            }

            const { lastInsertRowid: KOTId } = db2
                  .prepare(
                        "INSERT INTO KOT (order_id,restaurant_id,token_no,order_type,user_id,customer_name,number,address,landmark,table_id,table_no,print_count,KOT_status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))"
                  )
                  .run([orderId, restaurantId, tokenNo, orderType, userId, customerName, customerContact, customerAdd, customerLocality, tableNumber, tableNumber, 1, "accepted"]);

            db2.transaction(() => {
                  const prepareItem = db2.prepare(
                        "INSERT INTO KOT_items (KOT_id,item_id,item_name,quantity,variation_name,variation_id,description,itemTax) VALUES (?,?,?,?,?,?,?,?)"
                  );

                  const prepareToppings = db2.prepare("INSERT INTO KOT_item_addongroupitems (KOT_item_id,addongroupitem_id,name,quantity) VALUES (?,?,?,?)");

                  orderCart.forEach((item) => {
                        const { itemQty, itemId, itemName, variation_id, variantName, toppings, itemTax } = item;

                        const { lastInsertRowid: KOTItemId } = prepareItem.run([
                              KOTId,
                              itemId,
                              itemName,
                              itemQty,
                              variantName,
                              variation_id,
                              orderComment,
                              JSON.stringify(itemTax),
                        ]);

                        if (toppings.length !== 0) {
                              db2.transaction(() => {
                                    toppings.forEach((topping) => {
                                          const { id, type, price, qty } = topping;
                                          prepareToppings.run([KOTItemId, id, type, qty]);
                                    });
                              })();
                        }
                  });
            })();
      })();

      // const [{ created_at, token_no }] = await dbAll(db, "SELECT created_at,token_no FROM KOT ORDER BY ID DESC LIMIT 1", []);
      // const currentDate = new Date().getDate();
      // const lastKOTDate = new Date(created_at).getDate();

      // if (currentDate !== lastKOTDate || !lastKOTDate) {
      //       tokenNo = 1;
      // } else {
      //       tokenNo = token_no + 1;
      // }

      // const KOTId = await dbRun(
      //       db,
      //       "INSERT INTO KOT (restaurant_id,token_no,order_type,user_id,customer_name,number,address,landmark,table_id,table_no,print_count,KOT_status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))",
      //       [restaurantId, tokenNo, orderType, userId, customerName, customerContact, customerAdd, customerLocality, tableNumber, tableNumber, 1, "accepted"]
      // );

      // orderCart.forEach(async (item) => {
      //       const { itemQty, itemId, itemName, variation_id, variantName, toppings, itemTax } = item;

      //       const KOTItemId = await dbRun(
      //             db,
      //             "INSERT INTO KOT_items (KOT_id,item_id,item_name,quantity,variation_name,variation_id,description,itemTax) VALUES (?,?,?,?,?,?,?,?)",
      //             [KOTId, itemId, itemName, itemQty, variantName, variation_id, orderComment, JSON.stringify(itemTax)]
      //       );

      //       if (toppings) {
      //             toppings.forEach((topping) => {
      //                   const { id, type, price, qty } = topping;
      //                   KOT_addonGroup = dbRun(db, "INSERT INTO KOT_item_addongroupitems (KOT_item_id,addongroupitem_id,name,quantity) VALUES (?,?,?,?)", [
      //                         KOTItemId,
      //                         id,
      //                         type,
      //                         qty,
      //                   ]);
      //             });
      //       }
      // });
};

module.exports = { createKot };
