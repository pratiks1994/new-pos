const { dbAll, dbRun } = require("../common/dbExecute");
// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb");
const db2 = getDb();

const checkAndUpdateOrder = (order) => {

	let orderId = "";
	const matchOrder = db2
		.prepare("SELECT id FROM orders WHERE  order_type='dine_in' AND dine_in_table_no=? AND order_status = 'accepted' AND print_count= 0 AND settle_amount IS NULL")
		.get([order.tableNumber]);

	if (matchOrder?.id && order.orderType === "dine_in") {
		const { orderCart } = order;

		const matchOrderId = matchOrder.id;
		orderId = matchOrder.id;

		db2.prepare("UPDATE orders SET item_total = item_total + ? , total_discount = total_discount + ? , total_tax = total_tax + ? , total = total + ? ,print_count = ? WHERE id = ?").run([
			order.subTotal,
			order.discount,
			order.tax,
			order.cartTotal,
			order.printCount,
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
			orderCart.forEach(item => {
				const { itemQty, itemId, itemName, variation_id, variantName, itemTotal, multiItemTotal, toppings, itemTax, variant_display_name, itemNotes, parent_tax } = item;

				const totalItemTax = itemTax.reduce((total, tax) => (total += tax.tax), 0);
				const toppingsJson = JSON.stringify(toppings);

				const { lastInsertRowid: orderItemId } = db2
					.prepare(
						"INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity,variation_name,variation_id,description,tax_id,tax,item_addon_items) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
					)
					.run([matchOrderId, itemId, itemName, itemTotal, multiItemTotal, itemQty, variant_display_name, variation_id, itemNotes, parent_tax, totalItemTax, toppingsJson]);

			});
		})();

		return orderId;
	} else {
		return orderId;
	}
};

module.exports = { checkAndUpdateOrder };
