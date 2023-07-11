const { dbAll, dbRun } = require("../common/dbExecute");
const Database = require("better-sqlite3");
const db2 = new Database("restaurant.sqlite", {});

const getLiveOrders = () => {
	try {
		const liveOrders = db2
			.prepare(
				"SELECT id, order_number, customer_name, complete_address, phone_number, order_type, dine_in_table_no, description, item_total, total_discount, total_tax, delivery_charges, total, payment_type, order_status, created_at, print_count FROM orders WHERE (order_type IN ('delivery', 'pick_up') AND order_status NOT IN ('delivered', 'picked_up')) OR (order_type = 'dine_in' AND order_status = 'accepted' AND settle_amount IS NULL)"
			)
			.all([]);

		const prepareItem = db2.prepare("SELECT id,item_id,item_name,price,final_price,quantity,variation_name,variation_id FROM order_items WHERE order_id = ?");
		const prepareToppings = db2.prepare("SELECT addongroupitem_id,name,price,quantity FROM order_item_addongroupitems WHERE order_item_id = ?");
		const prepareTax = db2.prepare("SELECT tax_id,tax_amount FROM order_item_taxes WHERE order_item_id = ?");
		const prapareKOT = db2.prepare("SELECT id,token_no FROM kot WHERE order_id=?");

		const liveOrdersWithItems = liveOrders.map((order) => {
			const orderItems = prepareItem.all([order.id]);
			const KOTDetail = prapareKOT.get([order.id]);

			const itemsWithAddons = orderItems.map((item) => {
				const itemAddons = prepareToppings.all([item.id]);

				const itemTax = prepareTax.all([item.id]);

				return { ...item, itemAddons, itemTax };
			});

			return { ...order, items: itemsWithAddons, KOTDetail };
		});

		return liveOrdersWithItems;
	} catch (err) {
		console.log(err);
	}
};

module.exports = { getLiveOrders };
