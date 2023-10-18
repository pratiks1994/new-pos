const { getDb } = require("../common/getDb");
const db2 = getDb();

const modifyExistingOrder = order => {
	const { deliveryCharge, discount, cartTotal, tax, subTotal, orderCart, printCount, id: orderId, order_status } = order;

	const newItemStmt = db2.prepare(
		"INSERT INTO order_items (order_id,item_id,item_name,price,final_price,quantity,variation_name,variation_id,description,tax_id,tax,item_addon_items) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
	);
	
	const updateItemStmt = db2.prepare("UPDATE order_items SET quantity = ?, final_price = ? WHERE id =?");

	const deletItemStmt = db2.prepare("DELETE FROM order_items WHERE id = ?");

	try {
		db2.transaction(() => {
			db2.prepare(
				"UPDATE orders SET item_total = ?, total_discount = ?, total_tax = ?, delivery_charges = ?, total = ?, print_count = ?, order_status = ?, updated_at = datetime('now', 'localtime') WHERE id= ?"
			).run([subTotal, discount, tax, deliveryCharge, cartTotal, printCount, order_status, orderId]);

			orderCart.forEach(item => {
				const {
					currentOrderItemId,
					itemQty,
					itemId,
					itemName,
					variation_id,
					variantName,
					itemTotal,
					multiItemTotal,
					toppings,
					itemTax,
					variant_display_name,
					itemNotes,
					parent_tax,
					itemStatus,
				} = item;

				const totalItemTax = itemTax.reduce((total, tax) => (total += tax.tax), 0);
				const toppingsJson = JSON.stringify(toppings);

				if (itemStatus === "new") {
					newItemStmt.run([orderId, itemId, itemName, itemTotal, multiItemTotal, itemQty, variant_display_name, variation_id, itemNotes, parent_tax, totalItemTax, toppingsJson]);
				} else if (itemStatus === "updated") {
					updateItemStmt.run([itemQty, multiItemTotal, currentOrderItemId]);
				} else if (itemStatus === "removed") {
					deletItemStmt.run([currentOrderItemId]);
				}
			});
		})();

		return { orderId, success: true };
	} catch (error) {
		console.log(error);
		return { orderId, success: false };
	}
};

module.exports = { modifyExistingOrder };
