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

// TODO: the one list of protected names (never-kill list + hidden-from-display). Define once, here.
const blocked = ["Memory Compression", "MsMpEng"];

// TODO: takes an array of process-name strings, returns a new array without the protected ones.
// Must not touch processNames or the original array.
function filterProcessNames(processNameList) {
  const items = processNameList;
  const filtered = [];

  for (let item in items) {
    const cleanItem = item.trim();

    for (block in blocked) {
      if (cleanItem === block) {
      }
    }
  }
}

// module-level so both main and render can see/acsess

let clean_processNames = [];
ipcMain.on("main-TenProcesses", async () => {
  exec(
    //gets top 10 processes running ranked by memory
    //'powershell -Command "Get-Process | Sort-Object WS -Descending | Select-Object -First 10"',

    //gets top 10 processes running ranked by memory + converts to json
    'powershell -Command "Get-Process | Sort-Object WS -Descending | Select-Object -First 10  | Select-Object ProcessName | ConvertTo-Json"',
    (error, stdout, stderr) => {
      if (error) {
        console.log("Error: " + error);
        return;
      }
      let processes = JSON.parse(stdout.trim());
      let dirty_processNames = [];
      dirty_processNames = processes.map((item) => item.ProcessName);
      //filters and re-asigns
      clean_processNames = filterProcessNames(dirty_processNames);

      console.log(
        "\n--- \nTop 10 Processes by Memory usage: \n" + stdout + "---------",
      );
    },
  );
});

ipcMain.handle("main-getNames", async () => {
  return processNames;
  // return [
  //   { id: 1, name: "Chrome.exe", status: "Blocked" },
  //   { id: 2, name: "Discord.exe", status: "Allowed" },
  //   { id: 3, name: "Steam.exe", status: "Blocked" },
  // ];
});

app.whenReady().then(createWindow);

// On Windows, closing the last window should quit the app.
app.on("window-all-closed", () => {
  app.quit();
});
