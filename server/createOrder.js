const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const createOrder = (order) => {

     // create new order number
     const d = new Date();
     let orderNo = d.getTime();
     let userId = 85698;
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

     const db = new sqlite3.Database(path.join("restaurant.sqlite"), (err) => {
          if (err) {
               console.log(err);
          }
     });


     // insert data into orders table
     db.run(
          "INSERT INTO orders (user_id,order_number,restaurant_id,customer_name,complete_address,phone_number,order_type,dine_in_table_no,item_total,description,total_discount,total_tax,delivery_charges,total,payment_type,is_live,order_status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
               1,
               "accepted"

          ],
          function (err) {
               if (err) {
                    console.log(err);
               }
           
               // insert order item data into order_item table with order_id as id from above orders table entry
               let orderId = this.lastID;
               orderCart.forEach((item) => {
                    const {
                         itemQty,
                         itemId,
                         itemName,
                         variation_id,
                         variantName,
                         itemTotal,
                         multiItemTotal,
                         toppings,
                    } = item;


                    if(variation_id){

                         // if item has varient keep varient releted entries 


                    db.run(
                         "INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity,variation_name,variation_id) VALUES (?,?,?,?,?,?,?,?)",
                         [orderId, itemId , itemName, itemTotal, multiItemTotal, itemQty, variantName , variation_id ],
                         function(err){
                              if (err) {
                                   console.log(err);
                              }

                              let orderItemId = this.lastID

                              if(toppings){

                                   // item with varient has toppings insert topping data into oreder_item_addongroupitems table with id of above order_item table id

                              toppings.forEach(topping=>{

                                 const {id,type,price,qty} = topping

                                 db.run("INSERT INTO order_item_addongroupitems (order_item_id,addongroupitem_id,name,price,quantity) VALUES (?,?,?,?,?)",[orderItemId,id,type,price,qty]),(err)=>{
                                    if(err)console.log(err)
                                 }
                              })
                           }

                         }
                    );
                        }
                        else{

                         // else remove varient related entries from entry

                           db.run(
                         "INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity) VALUES (?,?,?,?,?,?)",
                         [orderId, itemId , itemName, itemTotal, multiItemTotal, itemQty],
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
};

module.exports = { createOrder };
