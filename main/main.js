const { app, BrowserWindow } = require("electron");
//const command = require("child_processes").exec;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("render/index.html");
}

app.whenReady().then(createWindow);

// On Windows, closing the last window should quit the app.
app.on("window-all-closed", () => {
  app.quit();
});

/*
command("[console]::beep(37, 600)", (error, stdout, stderr));
if (error) {
  console.log(error);
  return;
}
console.log(stdout);

*/
