const { contextBridge, ipcRenderer } = require("electron");

ipcApi = {
	request: (chanel, payload) => {
		return ipcRenderer.invoke(chanel, payload);
	},
};

contextBridge.exposeInMainWorld("apiKey", ipcApi);
