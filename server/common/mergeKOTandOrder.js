const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const mergeKOTandOrder = (order, KOTitems) => {
      let totalKOTTax = 0;
      let totalKOTCartTotal = 0;
      let totalsubTotal = 0;

      const formatedKOTItmes = KOTitems.map((item) => {

            // console.log(item.final_price);
            let taxTotal = item.item_tax.reduce((acc, tax) => {
                  acc += (+tax.tax)
                  return acc
            }, 0);

            totalKOTCartTotal += item.final_price;
            totalKOTTax += taxTotal;

            return {
                  currentOrderItemId: "",
                  itemQty: item.quantity,
                  itemId: item.item_id,
                  itemName: item.item_name,
                  variation_id: item.variation_id,
                  variantName: item.variation_name,
                  variant_display_name : item.variation_name,
                  basePrice: item.price,
                  itemTotal: item.price,
                  multiItemTotal: item.final_price,
                  itemNotes: "",
                  itemIdentifier: "",
                  toppings: item.item_addons,
                  itemTax: item.item_tax,
            };
      });

      return {
            ...order,
            cartTotal: order.cartTotal + totalKOTCartTotal + totalKOTTax,
            tax: order.tax + totalKOTTax,
            orderCart: [...order.orderCart, ...formatedKOTItmes],
            subTotal: order.subTotal + totalKOTCartTotal - totalKOTTax,
      };
};

module.exports = { mergeKOTandOrder };
