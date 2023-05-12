const { printBill } = require("./printBill");
const { dbAll, dbRun } = require("../common/dbExecute");

const createOrder = async (order, db) => {
      // create new order number
      // printBill(order)

      const [{ id }] = await dbAll(db, "SELECT id FROM orders ORDER BY ID DESC LIMIT 1", []);
      const orderNo = `ON00${id + 1}`;

      let userId;
      let restaurantId = 1;
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
            const user = await dbAll(db, "SELECT id FROM users WHERE number = ?", [customerContact.trim()]);

            if (!user.length) {
                  userId = await dbRun(db, "INSERT INTO users (name,number,password) VALUES(?,?,?)", [customerName, customerContact, ""]);
                  dbRun(db, "INSERT INTO user_addresses (user_id,complete_address,landmark) VALUES(?,?,?)", [userId, customerAdd, customerLocality]);
                  dbRun(db, "INSERT INTO users_groups (user_id,group_id) VALUES (?,?)", [userId, 1]);
            } else {
                  console.log(user);
                  userId = user[0].id;

                  if (customerAdd) {
                        const newAddId = await dbRun(
                              db,
                              "INSERT INTO user_addresses (user_id, complete_address,landmark) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM user_addresses WHERE user_id=? AND complete_address=? AND landmark=?)",
                              [userId, customerAdd.trim(), customerLocality.trim(), userId, customerAdd.trim(), customerLocality.trim()]
                        );
                        // const userAddresses = await dbAll(db, "SELECT complete_address FROM user_addresses WHERE user_id = ?", [userId])
                        // const isAddressExist = userAddresses.map(address => address.complete_address).includes(customerAdd)
                  }
            }
      }

      // insert data into orders table
      db.run(
            "INSERT INTO orders (user_id,order_number,restaurant_id,customer_name,complete_address,phone_number,order_type,dine_in_table_no,item_total,description,total_discount,total_tax,delivery_charges,total,payment_type,order_status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))",
            [
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
            ],
            function (err) {
                  if (err) {
                        console.log(err);
                  }

                  // insert order item data into order_item table with order_id as id from above orders table entry
                  let orderId = this.lastID;
                  orderCart.forEach((item) => {
                        const { itemQty, itemId, itemName, variation_id, variantName, itemTotal, multiItemTotal, toppings } = item;

                        if (variation_id) {
                              // if item has varient keep varient releted entries

                              db.run(
                                    "INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity,variation_name,variation_id) VALUES (?,?,?,?,?,?,?,?)",
                                    [orderId, itemId, itemName, itemTotal, multiItemTotal, itemQty, variantName, variation_id],
                                    function (err) {
                                          if (err) {
                                                console.log(err);
                                          }

                                          let orderItemId = this.lastID;

                                          if (toppings) {
                                                // item with varient has toppings insert topping data into oreder_item_addongroupitems table with id of above order_item table id

                                                toppings.forEach((topping) => {
                                                      const { id, type, price, qty } = topping;

                                                      db.run("INSERT INTO order_item_addongroupitems (order_item_id,addongroupitem_id,name,price,quantity) VALUES (?,?,?,?,?)", [
                                                            orderItemId,
                                                            id,
                                                            type,
                                                            price,
                                                            qty,
                                                      ]),
                                                            (err) => {
                                                                  if (err) console.log(err);
                                                            };
                                                });
                                          }
                                    }
                              );
                        } else {
                              // else remove varient related entries from entry

                              db.run(
                                    "INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity) VALUES (?,?,?,?,?,?)",
                                    [orderId, itemId, itemName, itemTotal, multiItemTotal, itemQty],
                                    (err) => {
                                          if (err) {
                                                console.log(err);
                                          }
                                    }
                              );
                        }
                  });
            }
      );

            return userId


};

module.exports = { createOrder };
