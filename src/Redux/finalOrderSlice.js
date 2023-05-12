import { createSlice } from "@reduxjs/toolkit";
import { act } from "@testing-library/react";

const finalOrderSlice = createSlice({
      name: "finalOrder",
      initialState: {
            customerName: "emerging coders",
            customerContact: "8238267210",
            customerAdd: "Rk Empire nr nana Mauva circle 9th floor 905 rajkot ",
            customerLocality: "Rajkot 360004",
            orderCart: [],
            subTotal: 0,
            tax: 0,
            deliveryCharge: 0,
            packagingCharge: 0,
            discount: 0,
            paymentMethod: "Cash",
            tableNumber: "",
            personCount: 0,
            orderType: "Dine In",
            orderComment: "",
            cartTotal: 0,
      },
      reducers: {
            addOrderItem: (state, action) => {
                  let orderItem = action.payload;
                  let existingItem = state.orderCart.find((item) => item.itemIdentifier === orderItem.itemIdentifier);

                  if (existingItem) {
                        existingItem.itemQty += 1;
                        existingItem.multiItemTotal = existingItem.itemQty * existingItem.itemTotal;
                        state.orderCart.forEach((item) => {
                              if (item.id === existingItem.id) {
                                    return existingItem;
                              }
                        });
                  } else {
                        return {
                              ...state,
                              orderCart: [...state.orderCart, orderItem],
                        };
                  }
            },
            modifyCartData: (state, action) => {
                  let data = action.payload;
                  return { ...state, ...data };
            },

            incrementQty: (state, action) => {
                  let { id } = action.payload;

                  state.orderCart.forEach((item) => {
                        if (item.currentOrderItemId === id) {
                              item.itemQty += 1;
                              item.multiItemTotal = item.itemQty * item.itemTotal;
                        }
                  });
            },

            decrementQty: (state, action) => {
                  let { id } = action.payload;
                  state.orderCart.forEach((item) => {
                        if (item.currentOrderItemId === id) {
                              if (item.itemQty > 1) {
                                    item.itemQty -= 1;
                                    item.multiItemTotal = item.itemQty * item.itemTotal;
                              }
                        }
                  });
            },

            removeItem: (state, action) => {
                  const { itemId } = action.payload;

                  return {
                        ...state,
                        orderCart: [...state.orderCart.filter((item) => item.currentOrderItemId !== itemId)],
                  };
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

            resetFinalOrder: (state) => {
                  return {
                        customerName: "",
                        customerContact: "",
                        customerAdd: "",
                        customerLocality: "",
                        orderCart: [],
                        subTotal: 0,
                        tax: 0,
                        deliveryCharge: 0,
                        packagingCharge: 0,
                        discount: 0,
                        paymentMethod: "Cash",
                        tableNumber: "",
                        personCount: 0,
                        orderType: "Dine In",
                        orderComment: "",
                        cartTotal: 0,
                  };
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

                  state.orderCart = order.orderCart.map((item) => {
                        let toppings = item.toppings.map((topping) => {
                              return { id: topping.addongroupitem_id, type: topping.name, price: topping.price, qty: topping.quantity };
                        });

                        return {
                              currentOrderItemId: item.currentOrderItemId,
                              itemQty: item.quantity,
                              itemId: item.item_id,
                              itemName: item.item_name,
                              variation_id: item.variation_id,
                              variationName: item.variation_name,
                              basePrice: item.basePrice,
                              toppings: toppings,
                              itemTotal: item.itemTotal,
                              multiItemTotal: item.multiItemTotal,
                              itemIdentifier: item.itemIdentifier,
                        };
                  });
            },
      },
});

export default finalOrderSlice.reducer;
export const { addOrderItem, incrementQty, decrementQty, removeItem, modifyCartData, calculateCartTotal, resetFinalOrder, setCustomerDetail, holdToFinalOrder } =
      finalOrderSlice.actions;
