import { createSlice } from "@reduxjs/toolkit";


const menuItemsSlice = createSlice({
   name:"menuItems",
   initialState:[],
   reducers:{
      setMenuItems :(state,action)=>{
           
           const {items} = action.payload
           return [...items]
          
      }

   }
})

export const {setMenuItems} = menuItemsSlice.actions
export default menuItemsSlice.reducer