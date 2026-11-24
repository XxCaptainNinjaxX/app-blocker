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
    //gets top 10 processes running ranked by memory
    //'powershell -Command "Get-Process | Sort-Object WS -Descending | Select-Object -First 10"',

    //gets top 10 processes running ranked by memory + converts to json
    'powershell -Command "Get-Process | Sort-Object WS -Descending | Select-Object -Skip 1 -First 10  | Select-Object ProcessName | ConvertTo-Json"',
    (error, stdout, stderr) => {
      if (error) {
        console.log("Error: " + error);
        return;
      }
      const JSONprocesses = JSON.parse(stdout);
      //let arrayProcesses = stringProcesses.map((process) => process.ProcessName);

      for (let i = 0; i < JSONprocesses.length; i++) {
        console.log(JSONprocesses[i].ProcessName);
      }

      console.log(
        "\n--- \nTop 10 Processes by Memory usage: \n" + stdout + "---------",
      );
    },
  );
});

ipcMain.handle("main-getTableData", async () => {
  return [
    { id: 1, name: "Chrome.exe", status: "Blocked" },
    { id: 2, name: "Discord.exe", status: "Allowed" },
    { id: 3, name: "Steam.exe", status: "Blocked" },
  ];
});

app.whenReady().then(createWindow);

// On Windows, closing the last window should quit the app.
app.on("window-all-closed", () => {
  app.quit();
});
