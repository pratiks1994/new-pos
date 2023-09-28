const mergeKOTandOrder = (order, KOTs) => {
	let totalKOTTax = 0;
	let totalKOTCartTotal = 0;
	let totalsubTotal = 0;

	const formatedKOTItmes = KOTs.orderCart.map(item => {

		let taxTotal = 0;

		const taxes = item.item_tax.map(tax => {
			taxTotal += tax.tax_amount;
			return { id: tax.tax_id, name: tax.tax_name, tax: tax.tax_amount };
		});

		totalKOTCartTotal += item.final_price;
		totalKOTTax += taxTotal * item.quantity;

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
			multiItemTotal: item.final_price,
			itemNotes: item.description,
			itemIdentifier: "",
			toppings: item.item_addons,
			itemTax: taxes,
			parent_tax: item.tax_id,
		};
	});



	return {
		...order,
        customerName : order.customerName ? order.customerName : KOTs.customerName,
		customerContact : order.customerContact ? order.customerContact : KOTs.customerContact,
		customerAdd : order.customerAdd ? order.customerAdd : KOTs.customerAdd,
		customerLocality : order.customerLocality ? order.customerLocality : KOTs.customerLocality,
		orderComment : order.orderComment ? KOTs.orderComment + ", " + order.orderComment : KOTs.orderComment, 
		cartTotal: order.cartTotal + totalKOTCartTotal + totalKOTTax,
		tax: order.tax + totalKOTTax,
		orderCart: [...formatedKOTItmes, ...order.orderCart],
		subTotal: order.subTotal + totalKOTCartTotal,
	};
};

module.exports = { mergeKOTandOrder };
