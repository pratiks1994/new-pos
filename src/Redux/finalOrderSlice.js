import { createSlice } from "@reduxjs/toolkit";

const finalOrderSlice = createSlice({
     name: "finalOrder",
     initialState: {
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
          cartTotal:0
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
                    return { ...state, orderCart: [...state.orderCart, orderItem] };
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

          calculateCartTotal:(state,action)=>{
               state.cartTotal = action.payload.cartTotal
               state.tax = action.payload.tax
               state.subTotal=action.payload.subTotal

          },

          resetFinalOrder : (state) => {
              return ({
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
               cartTotal:0
          })
               }
               

     },
});

export default finalOrderSlice.reducer;
export const { addOrderItem, incrementQty, decrementQty, removeItem, modifyCartData,calculateCartTotal,resetFinalOrder } = finalOrderSlice.actions;
