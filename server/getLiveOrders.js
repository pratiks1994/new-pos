const sqlite3 = require("sqlite3").verbose();

const getLiveOrders = async () => {
     const db = new sqlite3.Database("../restaurant.sqlite", (err) => {
          if (err) {
               console.log(err);
          }
     });

     const liveOrders = await Promise.all (  new Promise((res, rej) => {
          db.all(
               "SELECT id,customer_name,dine_in_table_no,description,item_total,total,payment_type,order_status,is_live FROM orders WHERE is_live=1",
               [],
               async (err, orders) => {
                    if (err) {
                         console.log(err);
                    } else {
                        res(orders)
                    }
               }
          );
     }))

     console.log(liveOrders)
};

getLiveOrders()

module.exports = { getLiveOrders };
