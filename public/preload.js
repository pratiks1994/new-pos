const { contextBridge, ipcRenderer } = require("electron");


ipcApi = {
request : (chanel,data) => {
   return ipcRenderer.invoke(chanel,data)}

}

contextBridge.exposeInMainWorld("apiKey", ipcApi);