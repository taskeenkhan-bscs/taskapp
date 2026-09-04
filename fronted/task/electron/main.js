import { app, BrowserWindow, Menu, Tray, nativeImage } from "electron";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let tray;
let isQuitting = false;
let backendProcess;

function startBundledBackend() {
  if (!app.isPackaged) {
    return;
  }

  const backendDirectory = path.join(process.resourcesPath, "backend");
  const backendEntry = path.join(backendDirectory, "index.js");

  backendProcess = spawn(process.execPath, [backendEntry], {
    cwd: backendDirectory,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      ELECTRON_DESKTOP: "true",
    },
    stdio: "inherit",
    windowsHide: true,
  });

  backendProcess.on("error", (error) => {
    console.error("Unable to start the bundled backend:", error);
  });
}

function stopBundledBackend() {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
    backendProcess = undefined;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 850,
    minWidth: 1000,
    minHeight: 650,

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Development
  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // Production
    mainWindow.loadFile(
      path.join(__dirname, "../dist/index.html")
    );
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startBundledBackend();
  const iconPath = path.join(
    __dirname,
    app.isPackaged ? "../dist/favicon.svg" : "../public/favicon.svg"
  );
  tray = new Tray(nativeImage.createFromPath(iconPath));
  tray.setToolTip("Task Management System");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Show TaskApp", click: () => mainWindow.show() },
      { type: "separator" },
      {
        label: "Quit",
        click: () => {
          isQuitting = true;
          stopBundledBackend();
          app.quit();
        },
      },
    ])
  );
  tray.on("click", () => mainWindow.show());
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform === "darwin") {
    app.quit();
  } else if (isQuitting) {
    stopBundledBackend();
    app.quit();
  }
});

app.on("before-quit", () => {
  isQuitting = true;
  stopBundledBackend();
});