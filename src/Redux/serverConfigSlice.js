import { createSlice } from "@reduxjs/toolkit";


const serverConfigSlice = createSlice({
   name:"serverConfig",
   initialState:{
      systemType:"client",
      IPAddress :"192.168.1.208"
   },
   reducers:{
      setSystem :(state,action)=>{
          const {name,value} = action.payload

          state[name]=value
      
          
      }

   }
})

export const {setSystem} = serverConfigSlice.actions
export default serverConfigSlice.reducer