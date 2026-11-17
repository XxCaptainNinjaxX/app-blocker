const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const exec = require("child_process").exec;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //connecting preload.js to main, dirname = directoryname, folder current file lives
      preload: path.join(__dirname, "./preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("render/index.html");
}

var cnt = 0;
ipcMain.on("main-lowerPitch", () => {
  exec(
    'powershell -Command "[console]::beep(200, 600)"',
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      cnt++;
      console.log("Lower pitch works! " + cnt);
    },
  );
});

ipcMain.on("main-higherPitch", () => {
  exec(
    'powershell -Command "[console]::beep(500, 600)"',
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      cnt++;
      console.log("Higher pitch works! " + cnt);
    },
  );
});

ipcMain.on("main-TenProcesses", () => {
  exec(
    'powershell -Command "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10"',
    (error, stdout, stderr) => {
      if (error) {
        console.log("Error: " + error);
        return;
      }
      console.log("mainProcesses function works");
      console.log(
        "\n\n --- \n\nTop 10 Processes by CPU usage: " +
          stdout +
          "\n\n ---------",
      );
    },
  );
});

app.whenReady().then(createWindow);

// On Windows, closing the last window should quit the app.
app.on("window-all-closed", () => {
  app.quit();
});
