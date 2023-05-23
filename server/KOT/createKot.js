const { dbAll, dbRun } = require("../common/dbExecute");

const createKot = async (order, db, userId) => {
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

      const [{ created_at, token_no }] = await dbAll(db, "SELECT created_at,token_no FROM KOT ORDER BY ID DESC LIMIT 1", []);
      const currentDate = new Date().getDate();
      const lastKOTDate = new Date(created_at).getDate();

      if (currentDate !== lastKOTDate || !lastKOTDate) {
            tokenNo = 1;
      } else {
            tokenNo = token_no + 1;
      }

      const KOTId = await dbRun(
            db,
            "INSERT INTO KOT (restaurant_id,token_no,order_type,user_id,customer_name,number,address,landmark,table_id,table_no,print_count,KOT_status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))",
            [restaurantId, tokenNo, orderType, userId, customerName, customerContact, customerAdd, customerLocality, tableNumber, tableNumber, 1, "accepted"]
      );

      orderCart.forEach(async (item) => {
            const { itemQty, itemId, itemName, variation_id, variantName, toppings, itemTax } = item;

            const KOTItemId = await dbRun(
                  db,
                  "INSERT INTO KOT_items (KOT_id,item_id,item_name,quantity,variation_name,variation_id,description,itemTax) VALUES (?,?,?,?,?,?,?,?)",
                  [KOTId, itemId, itemName, itemQty, variantName, variation_id, orderComment, JSON.stringify(itemTax)]
            );

            if (toppings) {
                  toppings.forEach((topping) => {
                        const { id, type, price, qty } = topping;
                        KOT_addonGroup = dbRun(db, "INSERT INTO KOT_item_addongroupitems (KOT_item_id,addongroupitem_id,name,quantity) VALUES (?,?,?,?)", [
                              KOTItemId,
                              id,
                              type,
                              qty,
                        ]);
                  });
            }
      });
};

module.exports = { createKot };
