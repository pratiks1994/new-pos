import { createSlice } from "@reduxjs/toolkit";

const printerSettingsSlice = createSlice({
      name: "printerSettings",
      initialState: [],
      reducers: {
            setPrinters: (state, action) => {
                  const { data } = action.payload;
                  return [...data];
            },
      },
});

export const { setPrinters } = printerSettingsSlice.actions;
export default printerSettingsSlice.reducer;
