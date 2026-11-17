const { contextBridge, ipcRenderer } = require("electron");

//anything put in here is available inside renderer process
const API = {
  preloadLowerPitch: () => ipcRenderer.send("main-lowerPitch"),
  preloadHigherPitch: () => ipcRenderer.send("main-higherPitch"),
};

//can name the window.___ wtv, just needs to match up with
//  exposeInMainWorld("____", API)

contextBridge.exposeInMainWorld("api", API);
