import { createSlice } from "@reduxjs/toolkit";
import { getIdentifier } from "../Utils/getIdentifier";

const reCalculateOrderData = state => {
	let subTotal = 0;
	let totalTax = 0;
	for (const item of state.orderCart) {
		subTotal += item.multiItemTotal;
	}

	for (const item of state.orderCart) {
		for (const taxItem of item.itemTax) {
			totalTax += taxItem.tax * item.itemQty;
		}
	}

	let cartTotal = subTotal + totalTax;
	state.cartTotal = cartTotal;
	state.tax = totalTax;
	state.subTotal = subTotal;
};

const initialFinalOrder = {
	id: "",
	printCount: 0,
	customerName: "emerging coders",
	customerContact: "8238267210",
	customerAdd: "Rk Empire nr nana Mauva circle 9th floor 905 rajkot ",
	customerLocality: "Rajkot 360004",
	tableArea: "",
	orderCart: [],
	subTotal: 0,
	tax: 0,
	deliveryCharge: 0,
	packagingCharge: 0,
	discount: 0,
	paymentMethod: "cash",
	tableNumber: "",
	personCount: 0,
	orderType: "delivery",
	orderComment: "",
	cartTotal: 0,
	order_status: "accepted",
};

const finalOrderSlice = createSlice({
	name: "finalOrder",
	initialState: initialFinalOrder,
	reducers: {
		addOrderItem: (state, action) => {
			let orderItem = action.payload;
			let existingItem = state.orderCart.find(item => item.itemIdentifier === orderItem.itemIdentifier);
			if (existingItem) {
				                                                                                       
				existingItem.itemQty += 1;
				existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;
			} else {
				state.orderCart.push(orderItem);
			}
			reCalculateOrderData(state);
		},

		modifyCartData: (state, action) => {
			let data = action.payload;
			return { ...state, ...data };
		},

		incrementQty: (state, action) => {
			let { id } = action.payload;
			let existingItem = state.orderCart.find(item => item.currentOrderItemId === id);
			existingItem.itemQty += 1;
			existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;

			reCalculateOrderData(state);
		},

		addItemNotes: (state, action) => {
			const { currentOrderItemId, notes } = action.payload;
			let existingItem = state.orderCart.find(item => item.currentOrderItemId === currentOrderItemId);
			existingItem.itemNotes = notes;
		},

		decrementQty: (state, action) => {
			let { id } = action.payload;
			let existingItem = state.orderCart.find(item => item.currentOrderItemId === id);
			if (existingItem.itemQty > 1) {
				existingItem.itemQty -= 1;
				existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;
			}

			reCalculateOrderData(state);
		},

		removeItem: (state, action) => {
			const { itemId } = action.payload;
			state.orderCart = state.orderCart.filter(item => item.currentOrderItemId !== itemId);
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

			state.orderCart = order.items.map(item => {
                   
				const itemIdentifier = getIdentifier(item.item_id,item.variation_id,item.itemAddons)
				let toppingsTotal = 0;

				let toppings = item.itemAddons.map(topping => {
					toppingsTotal += topping.quantity * topping.price;
					return { id: topping?.id, name: topping?.name, price: topping?.price, quantity: topping?.quantity };
				});

				let itemTax = item.itemTax.map(tax => {
					return { id: tax.tax_id, name: tax.tax_name, tax: tax.tax_amount };
				});

				return {
					currentOrderItemId: item.id,
					itemQty: item.quantity,
					itemId: item.item_id,
					itemName: item.item_name,
					variation_id: item.variation_id,
					variantName: item.variation_name,
					basePrice: item.price - toppingsTotal,
					toppings: item.itemAddons,
					itemTotal: item.price,
					multiItemTotal: item.price * item.quantity,
					itemTax: itemTax,
					itemNotes: item.description,
					parent_tax: item.tax_id,
					itemIdentifier
				};
			});
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
} = finalOrderSlice.actions;
