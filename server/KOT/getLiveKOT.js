// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb");
const db2 = getDb();

const getLiveKOT = () => {
	const liveKOTs = db2.prepare("SELECT * FROM kot WHERE (kot_status = 'accepted') OR (order_type = 'dine_in' AND order_id IS NULL)").all([]);
	// const liveKOTs = await dbAll(db, "SELECT * FROM KOT WHERE KOT_status = 'accepted'", []);

	const prepareKOTItem = db2.prepare("SELECT * FROM kot_items WHERE kot_id = ?");
	// const prepareAddon = db2.prepare("SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?");
	const parentTaxStmt = db2.prepare("SELECT child_ids FROM taxes where id=?");

	const taxesStmt = db2.prepare("SELECT * FROM taxes where id = ? ");

	const liveKOTsWithItems = liveKOTs.map((KOT) => {
		const KOTItems = prepareKOTItem.all([KOT.id]);
		// const KOTItems = await dbAll(db, "SELECT * FROM KOT_items WHERE KOT_id = ?", [KOT.id]);

		const itemsWithAddons = KOTItems.map((item) => {
			// const itemAddons = prepareAddon.all([item.id]);
			// const itemAddons = await dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?", [item.id]);

			const childTaxesString = item.tax_id ? parentTaxStmt.get(item.tax_id) : {child_ids:""};

			const taxesIdArray = childTaxesString.child_ids.length ? childTaxesString.child_ids.split(",") : [];

			const taxesArray = taxesIdArray.map((tax) => {
				const taxData = taxesStmt.get(tax);

                const itemTax = { tax_id: taxData.id, tax_name: taxData.name, tax_percent: taxData.tax, tax_amount: (taxData.tax * item.price) / 100 };
				return itemTax
			});


			return { ...item, item_addons: JSON.parse(item.item_addon_items), item_tax:taxesArray };
		});

		return { ...KOT, items: itemsWithAddons };
	});

	return liveKOTsWithItems;
};

module.exports = { getLiveKOT };
