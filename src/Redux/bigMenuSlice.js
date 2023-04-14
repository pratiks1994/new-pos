import { createSlice } from "@reduxjs/toolkit";


const bigMenuSlice = createSlice({
   name:"bigMenu",
   initialState:[],
   reducers:{
      setBigMenu :(state,action)=>{
           const {data} = action.payload
           return [...data]
          
      }

   }
})

export const {setBigMenu} = bigMenuSlice.actions
export default bigMenuSlice.reducer