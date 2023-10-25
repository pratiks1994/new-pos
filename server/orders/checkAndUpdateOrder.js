const { getDb } = require("../common/getDb");
const db2 = getDb();

const checkAndUpdateOrder = order => {
	let orderId = "";
	const matchOrder = db2
		.prepare(
			"SELECT id, item_total,total_discount,discount_percent FROM orders WHERE  order_type='dine_in' AND dine_in_table_no=? AND order_status = 'accepted' AND print_count= 0 AND settle_amount IS NULL"
		)
		.get([order.tableNumber]);

	if (matchOrder?.id && order.orderType === "dine_in") {
		const { orderCart, subTotal, discount_percent, discount, tax, printCount } = order;
		const matchOrderId = matchOrder.id;
		orderId = matchOrder.id;

		const newSubtotal = subTotal + matchOrder.item_total;
		let new_total_discount;
		let new_discount_percent = null;

		if (discount_percent || discount) {
			new_total_discount = discount_percent ? (newSubtotal * discount_percent) / 100 : discount;
			new_discount_percent = discount_percent;
		} else {
			new_total_discount = matchOrder.discount_percent ? (newSubtotal * matchOrder.discount_percent) / 100 : matchOrder.total_discount;
			new_discount_percent = matchOrder.discount_percent;
		}

		const discountFactor = new_total_discount / newSubtotal;

		db2.transaction(() => {
			const stmt = db2.prepare("UPDATE order_items SET final_price = price * (1 - ?), item_discount = price * ?, tax = price * (1 - ?) * tax / final_price WHERE order_id = ?");
			stmt.run([discountFactor, discountFactor, discountFactor, matchOrderId]);

			orderCart.forEach(item => {
				const { itemQty, itemId, itemName, variation_id, variantName, itemTotal, multiItemTotal, toppings, itemTax, item_discount, variant_display_name, itemNotes, parent_tax } = item;
				const toppingsJson = JSON.stringify(toppings);
				const new_item_discount = itemTotal * discountFactor;

				const final_price = itemTotal - new_item_discount;

				const totalTax = itemTax.reduce((total, tax) => {
					return (total += (final_price * tax.tax_percent) / 100);
				}, 0);

				const { lastInsertRowid: orderItemId } = db2
					.prepare(
						"INSERT INTO order_items (order_id,item_id,item_name,price,final_price, item_discount,quantity,variation_name,variation_id,description,tax_id,tax,item_addon_items) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
					)
					.run([
						matchOrderId,
						itemId,
						itemName,
						itemTotal,
						final_price,
						new_item_discount,
						itemQty,
						variant_display_name,
						variation_id,
						itemNotes,
						parent_tax,
						totalTax,
						toppingsJson,
					]);
			});
		})();

		const orderData = db2.prepare("SELECT SUM(tax * quantity) AS total_tax FROM order_items WHERE order_id = ?").all([matchOrderId]);
		const totalOrderTax = orderData[0].total_tax;

		db2.transaction(() => {
			db2.prepare("UPDATE orders SET item_total = ?, total_discount = ?, total_tax = ? , total = ?, discount_percent = ? , print_count = ? WHERE id = ?").run([
				newSubtotal,
				new_total_discount,
				totalOrderTax,
				newSubtotal - new_total_discount + totalOrderTax,
				new_discount_percent,
				printCount,
				matchOrderId,
			]);
		})();

		// db2.transaction(() => {
		// 	orderCart.forEach(item => {
		// 		const { itemQty, itemId, itemName, variation_id, variantName, itemTotal, multiItemTotal, toppings, itemTax,item_discount, variant_display_name, itemNotes, parent_tax } = item;

		// 		const totalItemTax = itemTax.reduce((total, tax) => (total += tax.tax), 0);
		// 		const toppingsJson = JSON.stringify(toppings);
		// 		const final_price = itemTotal - item_discount

		// 		const { lastInsertRowid: orderItemId } = db2
		// 			.prepare(
		// 				"INSERT INTO order_items (order_id,item_id,item_name,price,final_price, item_discount,quantity,variation_name,variation_id,description,tax_id,tax,item_addon_items) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
		// 			)
		// 			.run([matchOrderId, itemId, itemName, itemTotal, final_price, item_discount, itemQty, variant_display_name, variation_id, itemNotes, parent_tax, totalItemTax, toppingsJson]);

		// 	});
		// })();

		return orderId;
	} else {
		return orderId;
	}
};

module.exports = { checkAndUpdateOrder };
