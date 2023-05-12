const { dbAll, dbRun } = require("../common/dbExecute");

const createHoldOrder = async (order, db) => {
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

      const holdOrderId = await dbRun(
            db,
            "INSERT INTO hold_orders (restaurant_id,customer_name,complete_address,phone_number,order_type,dine_in_table_no,item_total,description,total_discount,total_tax,delivery_charges,total,payment_type,landmark,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))",
            [
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
                  customerLocality,
            ]
      );

      orderCart.forEach(async (item) => {
            const { itemQty, itemId, itemName, variation_id, variantName, toppings, currentOrderItemId, basePrice, itemTotal, multiItemTotal, itemIdentifier } = item;

            const holdOrderItemId = await dbRun(
                  db,
                  "INSERT INTO hold_order_items (Hold_order_id,item_id,item_name,quantity,variation_name,variation_id,description,currentOrderItemId,basePrice,itemTotal,multiItemTotal,itemIdentifier) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                  [holdOrderId, itemId, itemName, itemQty, variantName, variation_id, orderComment,currentOrderItemId,basePrice,itemTotal,multiItemTotal,itemIdentifier]
            );

            if (toppings) {
                  toppings.forEach((topping) => {
                        const { id, type, price, qty } = topping;
                        KOT_addonGroup = dbRun(db, "INSERT INTO hold_order_item_addongroupitems (hold_order_item_id,addongroupitem_id,name,quantity,price) VALUES (?,?,?,?,?)", [
                              holdOrderItemId,
                              id,
                              type,
                              qty,
                              price,
                        ]);
                  });
            }
      });
};

module.exports = { createHoldOrder };
