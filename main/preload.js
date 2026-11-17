const { contextBridge, ipcRenderer } = require("electron");

//anything put in here is available inside renderer process
const API = {
  runCommand: () => ipcRenderer.send("run-command"),
};

//can name the window.___ wtv, just needs to match up with
//  exposeInMainWorld("____", API)

contextBridge.exposeInMainWorld("api", API);
