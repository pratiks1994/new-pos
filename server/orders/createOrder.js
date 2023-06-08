const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const createOrder = (order) => {
      // create new order number
      // printBill(order)
      // console.log(order);

      const generateOrderNo = (id) => {
            const numString = String(id);
            const numZerosToAdd = 7 - numString.length;
            const zeros = "0".repeat(numZerosToAdd);
            return `ON${zeros}${id}`;
      };

      // const lastEntry = await dbAll(db, "SELECT id FROM orders ORDER BY ID DESC LIMIT 1", []);
      const { id } = db2.prepare("SELECT id FROM orders ORDER BY ID DESC LIMIT 1").get([]);
      // const orderNo = `ON00${id + 1}`;
      const currentId = id || 0;
      const orderNo = generateOrderNo(currentId);

      let userId;
      let restaurantId = 1;
      let orderId
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

      if (customerContact) {
            const existingUserInfo = db2.prepare("SELECT id FROM users WHERE number = ?").get([customerContact.trim()]);
            // const user = await dbAll(db, "SELECT id FROM users WHERE number = ?", [customerContact.trim()]);

            if (!existingUserInfo) {
                  db2.transaction(() => {
                        const newUserInfo = db2.prepare("INSERT INTO users (name,number,password) VALUES(?,?,?)").run([customerName, customerContact, ""]);
                        userId = newUserInfo.lastInsertRowid;
                        // userId = await dbRun(db, "INSERT INTO users (name,number,password) VALUES(?,?,?)", [customerName, customerContact, ""]);
                        db2.prepare("INSERT INTO user_addresses (user_id,complete_address,landmark) VALUES(?,?,?)").run([userId, customerAdd, customerLocality]);
                        // dbRun(db, "INSERT INTO user_addresses (user_id,complete_address,landmark) VALUES(?,?,?)", [userId, customerAdd, customerLocality]);
                        db2.prepare("INSERT INTO users_groups (user_id,group_id) VALUES (?,?)").run([userId, 1]);
                        // dbRun(db, "INSERT INTO users_groups (user_id,group_id) VALUES (?,?)", [userId, 1]);
                  })();
            } else {
                  userId = existingUserInfo.id;

                  if (customerAdd.trim() !== "") {
                        db2.prepare(
                              "INSERT INTO user_addresses (user_id, complete_address,landmark) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM user_addresses WHERE user_id=? AND complete_address=? AND landmark=?)"
                        ).run([userId, customerAdd?.trim(), customerLocality?.trim(), userId, customerAdd?.trim(), customerLocality?.trim()]);

                        // const newAddId = await dbRun(
                        //       db,
                        //       "INSERT INTO user_addresses (user_id, complete_address,landmark) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM user_addresses WHERE user_id=? AND complete_address=? AND landmark=?)",
                        //       [userId, customerAdd.trim(), customerLocality.trim(), userId, customerAdd.trim(), customerLocality.trim()]
                        // );
                        // const userAddresses = await dbAll(db, "SELECT complete_address FROM user_addresses WHERE user_id = ?", [userId])
                        // const isAddressExist = userAddresses.map(address => address.complete_address).includes(customerAdd)
                  }
            }
      }

      const orderTrans = db2.transaction((userId) => {
            const orderInfo = db2
                  .prepare(
                        "INSERT INTO orders (user_id,order_number,restaurant_id,customer_name,complete_address,phone_number,order_type,dine_in_table_no,item_total,description,total_discount,total_tax,delivery_charges,total,payment_type,order_status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))"
                  )
                  .run([
                        userId,
                        orderNo,
                        restaurantId,
                        customerName,
                        customerAdd,
                        customerContact,
                        orderType,
                        tableNumber,
                        subTotal,
                        orderComment,
                        discount,
                        tax,
                        deliveryCharge,
                        cartTotal,
                        paymentMethod,
                        "accepted",
                  ]);

            const cartTrans = db2.transaction((orderCart, orderId) => {

                  const prepareItem = db2.prepare(
                        "INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity,variation_name,variation_id) VALUES (?,?,?,?,?,?,?,?)"
                  );

                  const prepareTax = db2.prepare("INSERT INTO order_item_taxes (order_item_id,tax_id,tax,tax_amount) VALUES (?,?,?,?)");
                  
                  const prepareToppings = db2.prepare("INSERT INTO order_item_addongroupitems (order_item_id,addongroupitem_id,name,price,quantity) VALUES (?,?,?,?,?)");

                  orderCart.forEach((item) => {
                        const { itemQty, itemId, itemName, variation_id, variantName, itemTotal, multiItemTotal, toppings, itemTax } = item;

                        const itemInfo = prepareItem.run([orderId, itemId, itemName, itemTotal, multiItemTotal, itemQty, variantName, variation_id]);

                        const taxTrans = db2.transaction((itemTax, orderItemId) => {
                              itemTax.forEach((tax) => {
                                    prepareTax.run([orderItemId, tax.id, 2.5, tax.tax]);
                              });
                        });

                        taxTrans(itemTax, itemInfo.lastInsertRowid);

                        if (toppings.length !== 0) {
                              // item with varient has toppings insert topping data into oreder_item_addongroupitems table with id of above order_item table id

                              const toppingsTrans = db2.transaction((toppings, orderItemId) => {
                                    toppings.forEach((topping) => {
                                          const { id, type, price, qty } = topping;
                                          prepareToppings.run([orderItemId, id, type, price, qty]);
                                    });
                              });

                              toppingsTrans(toppings, itemInfo.lastInsertRowid);
                        }
                  });
            });

            cartTrans(orderCart, orderInfo.lastInsertRowid);
            orderId = orderInfo.lastInsertRowid
      });

      orderTrans(userId);

      // insert data into orders table
      // db.run(
      //       "INSERT INTO orders (user_id,order_number,restaurant_id,customer_name,complete_address,phone_number,order_type,dine_in_table_no,item_total,description,total_discount,total_tax,delivery_charges,total,payment_type,order_status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))",
      //       [
      //             userId,
      //             orderNo,
      //             restaurantId,
      //             customerName,
      //             customerAdd,
      //             customerContact,
      //             orderType,
      //             tableNumber,
      //             subTotal,
      //             orderComment,
      //             discount,
      //             tax,
      //             deliveryCharge,
      //             cartTotal,
      //             paymentMethod,
      //             "accepted",
      //       ],
      //       function (err) {
      //             if (err) {
      //                   console.log(err);
      //             }

      //             // insert order item data into order_item table with order_id as id from above orders table entry
      //             let orderId = this.lastID;

      //             // orderCart.forEach((item) => {
      //             //       const { itemQty, itemId, itemName, variation_id, variantName, itemTotal, multiItemTotal, toppings, itemTax } = item;

      //             //       if (variation_id) {
      //             //             // if item has varient keep varient releted entries

      //             //             db.run(
      //             //                   "INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity,variation_name,variation_id) VALUES (?,?,?,?,?,?,?,?)",
      //             //                   [orderId, itemId, itemName, itemTotal, multiItemTotal, itemQty, variantName, variation_id],
      //             //                   function (err) {
      //             //                         if (err) {
      //             //                               console.log(err);
      //             //                         }

      //             //                         let orderItemId = this.lastID;

      //             //                         // itemTax.forEach((tax) => {
      //             //                         //       dbRun(db, "INSERT INTO order_item_taxes (order_item_id,tax_id,tax,tax_amount) VALUES (?,?,?,?)", [
      //             //                         //             orderItemId,
      //             //                         //             tax.id,
      //             //                         //             2.5,
      //             //                         //             tax.tax,
      //             //                         //       ]);
      //             //                         // });

      //             //                         // toppings.forEach((topping) => {
      //             //                         //       const { id, type, price, qty } = topping;

      //             //                         //       db.run("INSERT INTO order_item_addongroupitems (order_item_id,addongroupitem_id,name,price,quantity) VALUES (?,?,?,?,?)", [
      //             //                         //             orderItemId,
      //             //                         //             id,
      //             //                         //             type,
      //             //                         //             price,
      //             //                         //             qty,
      //             //                         //       ]),
      //             //                         //             (err) => {
      //             //                         //                   if (err) console.log(err);
      //             //                         //             };
      //             //                         // });
      //             //                   }
      //             //             );
      //             //       } else {
      //             //             // else remove varient related entries from entry

      //             //             db.run(
      //             //                   "INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity) VALUES (?,?,?,?,?,?)",
      //             //                   [orderId, itemId, itemName, itemTotal, multiItemTotal, itemQty],
      //             //                   function (err) {
      //             //                         if (err) {
      //             //                               console.log(err);
      //             //                         } else {
      //             //                               let orderItemId = this.lastID;
      //             //                               itemTax.forEach((tax) => {
      //             //                                     dbRun(db, "INSERT INTO order_item_taxes (order_item_id,tax_id,tax,tax_amount) VALUES (?,?,?,?)", [
      //             //                                           orderItemId,
      //             //                                           tax.id,
      //             //                                           2.5,
      //             //                                           tax.tax,
      //             //                                     ]);
      //             //                               });
      //             //                         }
      //             //                   }
      //             //             );
      //             //       }
      //             // });
      //       }
      // );
 console.log(`userId ${userId}, orderId ${orderId}`)
      return ({userId,orderId});
};

module.exports = { createOrder };
