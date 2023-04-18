import { configureStore } from "@reduxjs/toolkit";
import currentItemReducer from "./currentItemSlice";
import finaOrderReducer from "./finalOrderSlice"
import menuItemsReducer from "./menuItemsSlice"
import bigMenuReducer from "./bigMenuSlice"
import serveConfigReducer from "./serverConfigSlice"

 const store = configureStore(
   {
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
         immutableCheck: { warnAfter: 128 },
         serializableCheck: { warnAfter: 128 },
       }),
      reducer:{
         currentItem : currentItemReducer,
         finalOrder : finaOrderReducer,
         menuItems: menuItemsReducer,
         bigMenu : bigMenuReducer,
         serverConfig : serveConfigReducer,

      }
   }
)

export default store
