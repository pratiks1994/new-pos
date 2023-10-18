import { createSlice } from "@reduxjs/toolkit";
import { getIdentifier } from "../Utils/getIdentifier";

const reCalculateOrderData = state => {
	let subTotal = 0;
	let totalTax = 0;

	for (const item of state.orderCart) {
		if (!["removed", "cancelled"].includes(item.itemStatus)) {
			subTotal += item.multiItemTotal;
		}
	}

	for (const item of state.orderCart) {
		if (!["removed", "cancelled"].includes(item.itemStatus)) {
			for (const taxItem of item.itemTax) {
				totalTax += taxItem.tax * item.itemQty;
			}
		}
	}

	let cartTotal = subTotal + totalTax;
	state.cartTotal = cartTotal;
	state.tax = totalTax;
	state.subTotal = subTotal;
};

const initialFinalOrder = {
	kotsDetail: [],
	id: "",
	online_order_id: null,
	cartAction: "default", // defines mode of cart default => new order , modifyOrder => modifying existing order
	printCount: 0, // no of printed invoices
	customerName: "emerging coders",
	customerContact: "8238267210",
	customerAdd: "Rk Empire nr nana Mauva circle 9th floor 905 rajkot ",
	customerLocality: "Rajkot 360004",
	tableArea: "",
	orderCart: [], // items in order
	subTotal: 0, // total of the cart without tax
	tax: 0, // total tax of whole cart
	deliveryCharge: 0,
	packagingCharge: 0,
	discount: 0,
	discount_percent: null,
	discount_type: "flat",
	paymentMethod: "cash",
	tableNumber: "",
	personCount: 0,
	orderType: "delivery",
	orderComment: "",
	cartTotal: 0, // subtotal + tax (amount should be payable)
	order_status: "accepted",
};

const finalOrderSlice = createSlice({
	name: "finalOrder",
	initialState: initialFinalOrder,
	reducers: {
		addOrderItem: (state, action) => {
			let orderItem = action.payload;
			let existingItem = state.orderCart.find(item => item.itemIdentifier === orderItem.itemIdentifier && !["removed", "cancelled"].includes(item.itemStatus));

			if (state.cartAction === "default") {
				if (existingItem) {
					existingItem.itemQty += 1;
					existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;
				} else {
					orderItem.itemStatus = "default";
					state.orderCart.push(orderItem);
				}
			}

			if (state.cartAction === "modifyOrder" || state.cartAction === "modifyKot") {
				if (existingItem) {
					if (existingItem.itemStatus === "default") {
						existingItem.itemStatus = "updated";
					}
					existingItem.itemQty += 1;
					existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;
				} else {
					orderItem.itemStatus = "new";
					state.orderCart.push(orderItem);
				}
			}

			reCalculateOrderData(state);
		},

		modifyCartData: (state, action) => {
			let data = action.payload;
			return { ...state, ...data };
		},

		incrementQty: (state, action) => {
			let { id } = action.payload;
			let existingItem = state.orderCart.find(item => item.currentOrderItemId === id && !["removed", "cancelled"].includes(item.itemStatus));

			if (state.cartAction === "default") {
				existingItem.itemQty += 1;
				existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;
			} else if (state.cartAction === "modifyOrder" || state.cartAction === "modifyKot") {
				if (existingItem.itemStatus === "default") {
					existingItem.itemStatus = "updated";
				}
				existingItem.itemQty += 1;
				existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;
			}

			reCalculateOrderData(state);
		},

		addItemNotes: (state, action) => {
			const { currentOrderItemId, notes } = action.payload;
			let existingItem = state.orderCart.find(item => item.currentOrderItemId === currentOrderItemId);
			existingItem.itemNotes = notes;
		},

		decrementQty: (state, action) => {
			let { id } = action.payload;
			let existingItem = state.orderCart.find(item => item.currentOrderItemId === id && !["removed", "cancelled"].includes(item.itemStatus));

			if (existingItem.itemQty > 1) {
				if (state.cartAction === "default") {
					existingItem.itemQty -= 1;
					existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;
				} else if (state.cartAction === "modifyOrder" || state.cartAction === "modifyKot") {
					if (existingItem.itemStatus === "default") {
						existingItem.itemStatus = "updated";
					}
					existingItem.itemQty -= 1;
					existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;
				}
			}
			reCalculateOrderData(state);
		},

		removeItem: (state, action) => {
			const { itemId, itemStatus } = action.payload;
			if (state.cartAction === "default") {
				state.orderCart = state.orderCart.filter(item => item.currentOrderItemId !== itemId);
			} else if (state.cartAction === "modifyOrder" || state.cartAction === "modifyKot") {
				if (itemStatus === "new") {
					state.orderCart = state.orderCart.filter(item => item.currentOrderItemId !== itemId);
				} else {
					state.orderCart = state.orderCart.map(item => {
						if (item.currentOrderItemId === itemId) {
							item.itemStatus = "removed";
							return item;
						} else {
							return item;
						}
					});
				}
			}
			reCalculateOrderData(state);
		},

		calculateCartTotal: (state, action) => {
			state.cartTotal = action.payload.cartTotal;
			state.tax = action.payload.tax;
			state.subTotal = action.payload.subTotal;
		},

		setCustomerDetail: (state, action) => {
			const { name, addresses, number } = action.payload;

			if (addresses.length) {
				state.customerAdd = addresses[0].complete_address;
				state.customerLocality = addresses[0].landmark;
			} else {
				state.customerAdd = "";
				state.customerLocality = "";
			}

			state.customerName = name;
			state.customerContact = number;
		},

		resetFinalOrder: state => {
			return initialFinalOrder;
		},

		holdToFinalOrder: (state, action) => {
			const { order } = action.payload;
			state.customerName = order.customer_name;
			state.customerContact = order.phone_number;
			state.customerAdd = order.complete_address;
			state.customerLocality = order.landmark;
			state.subTotal = order.item_total;
			state.tax = order.total_tax;
			state.deliveryCharge = order.delivery_charges;
			state.packagingCharge = 0;
			state.discount = order.total_discount;
			state.paymentMethod = order.payment_type;
			state.tableNumber = order.dine_in_table_no;
			state.orderType = order.order_type;
			state.cartTotal = order.total;
			state.orderComment = order.description;
			state.printCount = 0;

			state.orderCart = order.orderCart.map(item => {
				let toppings = item.toppings.map(topping => {
					return { id: topping.addongroupitem_id, type: topping.name, price: topping.price, qty: topping.quantity };
				});

				return {
					currentOrderItemId: item.currentOrderItemId,
					itemQty: item.quantity,
					itemId: item.item_id,
					categoryId: item.category_id,
					itemName: item.item_name,
					variation_id: item.variation_id,
					variationName: item.variation_name,
					basePrice: item.basePrice,
					toppings: toppings,
					itemTotal: item.itemTotal,
					multiItemTotal: item.multiItemTotal,
					itemIdentifier: item.itemIdentifier,
					itemTax: item.itemTax,
				};
			});
		},

		changePriceOnAreaChange: (state, action) => {
			state.orderCart = action.payload.newCartItems;

			reCalculateOrderData(state);
		},

		liveOrderToCart: (state, action) => {
			const { order } = action.payload;
			state.cartAction = "modifyOrder";
			state.customerName = order.customer_name;
			state.customerContact = order.phone_number;
			state.customerAdd = order.complete_address;
			state.subTotal = order.item_total;
			state.tax = order.total_tax;
			state.deliveryCharge = order.delivery_charges;
			state.packagingCharge = 0;
			state.discount = order.total_discount;
			state.paymentMethod = order.payment_type;
			state.tableNumber = order.dine_in_table_no;
			state.orderType = order.order_type;
			state.cartTotal = order.total;
			state.orderComment = order.description;
			state.id = order.id;
			state.order_status = order.order_status;
			state.printCount = order.print_count;
			state.tableArea = order.areaName;
			state.kotsDetail = order.KOTDetail;

			state.orderCart = order.items.map(item => {
				const itemIdentifier = getIdentifier(item.item_id, item.variation_id, item.itemAddons);

				let toppingsTotal = item.itemAddons.reduce((total, topping) => (total += topping.quantity * topping.price), 0);

				let itemTax = item.itemTax.map(tax => {
					return { id: tax.tax_id, name: tax.tax_name, tax: tax.tax_amount };
				});

				return {
					currentOrderItemId: item.id,
					itemStatus: "default",
					itemQty: item.quantity,
					itemId: item.item_id,
					itemName: item.item_name,
					variation_id: item.variation_id,
					variantName: item.variation_name,
					variant_display_name: item.variation_name,
					basePrice: item.price - toppingsTotal,
					toppings: item.itemAddons,
					itemTotal: item.price,
					multiItemTotal: item.price * item.quantity,
					itemTax: itemTax,
					itemNotes: item.description,
					parent_tax: item.tax_id,
					itemIdentifier,
				};
			});
		},

		liveKotToCart: (state, action) => {
			const { KOT, kotsDetail } = action.payload;
			state.cartAction = "modifyKot";
			state.customerName = KOT.customer_name;
			state.customerContact = KOT.phone_number;
			state.customerAdd = KOT.address;
			state.deliveryCharge = 0;
			state.packagingCharge = 0;
			state.discount = 0;
			state.paymentMethod = "cash";
			state.tableNumber = KOT.table_no;
			state.orderType = KOT.order_type;
			state.orderComment = KOT.description;
			state.id = KOT.id;
			state.order_status = KOT.kot_status;
			state.printCount = 0;
			state.tableArea = KOT.areaName;
			state.kotsDetail = kotsDetail;

			let subTotal = 0;
			let tax = 0;

			state.orderCart = KOT.items.map(item => {
				const itemIdentifier = getIdentifier(item.item_id, item.variation_id, item.item_addons);

				let toppingsTotal = item.item_addons.reduce((total, topping) => (total += topping.quantity * topping.price), 0);

				subTotal += item.status === -1 ? 0 : item.price * item.quantity;
				tax += item.status === -1 ? 0 : item.tax * item.quantity;

				let itemTax = item.item_tax.map(tax => {
					return { id: tax.tax_id, name: tax.tax_name, tax: tax.tax_amount };
				});

				return {
					currentOrderItemId: item.id,
					itemStatus: item.status === -1 ? "cancelled" : "default",
					itemQty: item.quantity,
					itemId: item.item_id,
					itemName: item.item_name,
					variation_id: item.variation_id,
					variantName: item.variation_name,
					variant_display_name: item.variation_name,
					basePrice: item.price - toppingsTotal,
					toppings: item.item_addons,
					itemTotal: item.price,
					multiItemTotal: item.price * item.quantity,
					itemTax: itemTax,
					itemNotes: item.description,
					parent_tax: item.tax_id,
					itemIdentifier,
					categoryId: item.categoryId,
					kotId: item.kotId || KOT.id,
				};
			});

			state.subTotal = subTotal;
			state.tax = tax;
			state.cartTotal = subTotal + tax;
		},
		applyDiscount: (state, action) => {
			const { discountType, discount } = action.payload;
			state.discount_type = discountType;

			if (discountType === "percent") {
				state.discount_percent = discount;
				const flatDiscount = (state.subTotal * discount) / 100;
				state.discount = flatDiscount;

				
			} else {
				state.discount_percent = null;
				state.discount = discount;
			}
		},
	},
});

export default finalOrderSlice.reducer;
export const {
	addOrderItem,
	incrementQty,
	decrementQty,
	removeItem,
	modifyCartData,
	calculateCartTotal,
	resetFinalOrder,
	setCustomerDetail,
	holdToFinalOrder,
	liveOrderToCart,
	addItemNotes,
	changePriceOnAreaChange,
	liveKotToCart,
	applyDiscount,
} = finalOrderSlice.actions;
