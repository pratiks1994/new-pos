const mergeKOTandOrder = (order, KOTs) => {
	let new_tax = 0;
	const new_subtotal = KOTs.subTotal + order.subTotal;
	const discount = order.discount_type === "percent" ? (new_subtotal * order.discount_percent) / 100 : order.discount;
	const discount_factor = discount / new_subtotal;

	const formatedKOTItmes = KOTs.orderCart.map(item => {
		let taxTotal = 0;
		const item_discount = item.price * discount_factor;

		const taxes = item.item_tax.map(tax => {
			const tax_after_discount = ((item.price - item_discount) * tax.tax_percent) / 100;
			taxTotal += tax_after_discount;
			return { id: tax.tax_id, name: tax.tax_name, tax: tax_after_discount, tax_percent: tax.tax_percent };
		});

		new_tax += taxTotal * item.quantity;

		return {
			currentOrderItemId: "",
			itemQty: item.quantity,
			itemId: item.item_id,
			itemName: item.item_name,
			variation_id: item.variation_id,
			variantName: item.variation_name,
			variant_display_name: item.variation_name,
			basePrice: item.price,
			itemTotal: item.price,
			multiItemTotal: item.final_price * item.quantity,
			itemNotes: item.description,
			itemIdentifier: "",
			item_discount,
			toppings: item.item_addons,
			itemTax: taxes,
			parent_tax: item.tax_id,
		};
	});

	order.orderCart.forEach(item => {
		let total_item_tax = 0;
		item.item_discount = item.itemTotal * discount_factor;

		item.itemTax.forEach(taxDetail => {
			const tax_after_discount = ((item.itemTotal - item.item_discount) * taxDetail.tax_percent) / 100;
			total_item_tax += tax_after_discount;
			taxDetail.tax = tax_after_discount;
		});

		new_tax += total_item_tax * item.itemQty;
	});

	return {
		...order,
		customerName: order.customerName ? order.customerName : KOTs.customerName,
		customerContact: order.customerContact ? order.customerContact : KOTs.customerContact,
		customerAdd: order.customerAdd ? order.customerAdd : KOTs.customerAdd,
		customerLocality: order.customerLocality ? order.customerLocality : KOTs.customerLocality,
		orderComment: order.orderComment ? KOTs.orderComment + ", " + order.orderComment : KOTs.orderComment,
		cartTotal: new_subtotal + new_tax - discount,
		tax: new_tax,
		orderCart: [...formatedKOTItmes, ...order.orderCart],
		subTotal: new_subtotal,
		discount,
	};
};

module.exports = { mergeKOTandOrder };
