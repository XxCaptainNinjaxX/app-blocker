const { contextBridge, ipcRenderer } = require("electron");

//anything put in here is available inside renderer process
const API = {
  preload_LowerPitch: () => ipcRenderer.send("main-lowerPitch"),
  preload_HigherPitch: () => ipcRenderer.send("main-higherPitch"),
  preload_TenProcesses: () => ipcRenderer.send("main-TenProcesses"),

  preload_getTableData: () => ipcRenderer.invoke("main-getTableData"),
};

//can name the window.___ wtv, just needs to match up with
//  exposeInMainWorld("____", API)

contextBridge.exposeInMainWorld("api", API);
