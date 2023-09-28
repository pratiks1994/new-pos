import { createSlice } from "@reduxjs/toolkit";

const UIActiveSlice = createSlice({
	name: "UIActive",
	initialState: { liveViewOrderType: "all", liveViewOrderStatus: "", isCartActionDisable: false, holdOrderCount: 0, restaurantPriceId:null, cartAction:"default"},
	reducers: {
		modifyUIActive: (state,action) => ({...state,...action.payload}),

		setActive: (state, action) => {
			const { key, name } = action.payload;
			state[key] = name;
		},
	},
});

export const { setActive,modifyUIActive } = UIActiveSlice.actions;
export default UIActiveSlice.reducer;
