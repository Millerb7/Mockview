// main.js

// Importing necessary modules from Electron
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

// Function to create the main window of the application
function createWindow() {
  console.log("creating window");
  // Create a new browser window
  mainWindow = new BrowserWindow({
    width: 800,  // window width
    height: 600, // window height
    webPreferences: {
      nodeIntegration: true, // allows Node.js integration (be cautious with this setting)
      contextIsolation: false // isolate context if nodeIntegration is true
    }
  });

  // Load the index.html of the app (or a URL in case of a web app)
  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : './mockview/public/index.html'
  );

  // Open DevTools - Remove this line if you don't want a dev console
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.on('ready', createWindow);

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, re-create a window in the app when the dock icon is clicked
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

