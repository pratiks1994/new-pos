// const { dbAll, dbRun } = require("../common/dbExecute");
// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb");
const db2 = getDb();

const getLiveOrders = () => {
	try {
		const liveOrders = db2
			.prepare(
				"SELECT id, order_number, customer_name, complete_address, phone_number, order_type, dine_in_table_no, description, item_total, total_discount, total_tax, delivery_charges, total, payment_type, order_status, created_at, print_count,online_order_id FROM orders WHERE (order_type IN ('delivery', 'pick_up') AND order_status NOT IN ('delivered', 'picked_up','rejected','cancelled','pending','pending_payment')) OR (order_type = 'dine_in' AND order_status = 'accepted' AND settle_amount IS NULL)"
			)
			.all([]);

		const prepareItem = db2.prepare(
			"SELECT id,item_id,item_name,price,final_price,quantity,variation_name,variation_id,tax_id,item_addon_items,description FROM order_items WHERE order_id = ?"
		);
		// const prepareToppings = db2.prepare("SELECT addongroupitem_id,name,price,quantity FROM order_item_addongroupitems WHERE order_item_id = ?");
		// const prepareTax = db2.prepare("SELECT tax_id,tax_amount FROM order_item_taxes WHERE order_item_id = ?");
		const prapareKOT = db2.prepare("SELECT id,token_no FROM kot WHERE order_id=?");
		const parentTaxStmt = db2.prepare("SELECT child_ids FROM taxes where id=?");
		const taxesStmt = db2.prepare("SELECT * FROM taxes where id = ? ");
		
		const tableStmt = db2.prepare("SELECT area_id FROM dine_in_tables WHERE table_no=?");
		const areaStmt = db2.prepare("SELECT id,area,restaurant_price_id FROM areas WHERE id=?");
		const defaultResaurantPriceStmt = db2.prepare("SELECT configuration FROM restaurants WHERE id=?");
		const configDetail = defaultResaurantPriceStmt.get([1]);
		const defaultRestaurantPrice = JSON.parse(configDetail.configuration).default_restaurant_price;

		const liveOrdersWithItems = liveOrders.map(order => {
			const orderItems = prepareItem.all([order.id]);

			let restaurantPriceId = + defaultRestaurantPrice || null;
			let areaName = "";
			let areaId = "";

			if (order.order_type === "dine_in") {
				const table = tableStmt.get(order.dine_in_table_no);

				if (table && table.area_id) {
				  const area = areaStmt.get(table.area_id);
				  restaurantPriceId = +area.restaurant_price_id;
				  areaName = area.area;
				  areaId = area.id;
				}
			  }

			const KOTDetail = prapareKOT.all([order.id]);

			const itemsWithAddons = orderItems.map(item => {
				const childTaxesString = item.tax_id ? parentTaxStmt.get(item.tax_id) : { child_ids: "" };

				const taxesIdArray = childTaxesString.child_ids.length ? childTaxesString.child_ids.split(",") : [];

				const taxesArray = taxesIdArray.map(tax => {
					const taxData = taxesStmt.get(tax);

					const itemTax = { tax_id: taxData.id, tax_name: taxData.name, tax_percent: taxData.tax, tax_amount: (taxData.tax * item.price) / 100 };
					return itemTax;
				});

				// const itemAddons = prepareToppings.all([item.id]);

				// const itemTax = prepareTax.all([item.id]);

				return { ...item, itemAddons: JSON.parse(item.item_addon_items), itemTax: taxesArray };
			});

			return { ...order, items: itemsWithAddons, KOTDetail,restaurantPriceId,areaName,areaId };
		});

		return liveOrdersWithItems;
	} catch (err) {
		console.log(err);
	}
};

module.exports = { getLiveOrders };
