const { getDb } = require("../common/getDb");
const { createKot } = require("./createKot");
const db2 = getDb();

const modifyKot = (order, orderData) => {
	const KOTId = order.id;
	const orderId = orderData.orderId;
	const userId = orderData.userId;
	let newKotTokenNo = null;

	const kotUpdateStmt = db2.prepare("UPDATE kot SET order_id = ? , user_id = ? WHERE id = ?");
	const allDineInKotsUpdateStmt = db2.prepare("UPDATE kot SET order_id = ? , user_id = ? WHERE order_type='dine_in' AND table_no=? AND order_id IS NULL");

	const kotTokeData = db2.prepare("SELECT token_no FROM kot WHERE Id=?").get(KOTId);

	const addItemStmt = db2.prepare(
		"INSERT INTO kot_items (kot_id,item_id,item_name,quantity,variation_name,variation_id,description,tax,price,final_price,item_addon_items,tax_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
	);

	const updateItemStmt = db2.prepare("UPDATE kot_items SET quantity = ?, final_price = ? WHERE id =? ");

	const removeItemStmt = db2.prepare("UPDATE kot_items SET status = ? WHERE id=?");
	let newKotItems = [];

	db2.transaction(() => {

		if (order.orderType === "dine_in") {
			allDineInKotsUpdateStmt.run([orderId,userId, order.tableNumber]);
		} else {
			kotUpdateStmt.run(orderId, userId, KOTId);
		}

		order.orderCart.forEach(item => {
			const {
				currentOrderItemId,
				itemQty,
				itemId,
				itemName,
				variation_id,
				itemNotes,
				variantName,
				toppings,
				itemTax,
				itemTotal,
				itemStatus,
				multiItemTotal,
				variant_display_name,
				parent_tax,
			} = item;

			if (itemStatus === "new" && order.orderType !== "dine_in") {
				const totalItemTax = itemTax.reduce((total, tax) => (total += tax.tax), 0);

				const { lastInsertRowid: KOTItemId } = addItemStmt.run([
					KOTId,
					itemId,
					itemName,
					itemQty,
					variant_display_name,
					variation_id,
					itemNotes,
					totalItemTax,
					itemTotal,
					multiItemTotal,
					JSON.stringify(toppings),
					parent_tax,
				]);
			} else if (itemStatus === "new" && order.orderType === "dine_in") {
				newKotItems.push(item);
			} else if (itemStatus === "updated") {
				updateItemStmt.run([itemQty, multiItemTotal, currentOrderItemId]);
			} else if (itemStatus === "removed") {
				removeItemStmt.run([-1, currentOrderItemId]);
			}
		});
	})();

	if (order.orderType === "dine_in" && newKotItems.length) {
		const newKot = { ...order, orderCart: newKotItems };
		newKotTokenNo = createKot(newKot, userId, orderId);
	}

	return { kotTokenNo: kotTokeData.token_no, newKotTokenNo };
};

module.exports = { modifyKot };
