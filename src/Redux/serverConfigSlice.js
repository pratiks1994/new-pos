import { createSlice } from "@reduxjs/toolkit";


const serverConfigSlice = createSlice({
   name:"serverConfig",
   initialState:"client",
   reducers:{
      setSystem :(state,action)=>{
          return action.payload.system
      
          
      }

   }
})

export const {setSystem} = serverConfigSlice.actions
export default serverConfigSlice.reducer