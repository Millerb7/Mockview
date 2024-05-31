const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process'); // Import spawn

let mainWindow = null;
let backendProcess = null; // Declare a variable to hold the backend process

// Function to start the backend process
function startBackend() {
  if (isDev) {
    console.log('Running in development');
  } else {
    console.log('Running in production');
  }
  // Path to the Python executable, adjust the path as needed
  const backendExecutablePath = isDev
    ? path.join(__dirname, 'frontend/flaskComb/flaskComb.exe') // Development path
    : path.join(process.resourcesPath, 'flaskComb', 'flaskComb.exe'); // Production path
  console.log(backendExecutablePath);
  backendProcess = spawn(backendExecutablePath);

  backendProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

app.on('ready', () => {
  createWindow();
  startBackend(); // Start the backend when the app is ready
  // You might want to check the backend health at regular intervals
  setInterval(checkBackendHealth, 60000); 
});

app.on('window-all-closed', function () {
  if (backendProcess !== null) {
    backendProcess.kill(); // Kill the backend process when the app is closed
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 1024,
    webPreferences: {
      nodeIntegration: true, // If needed for Electron version < 5
      contextIsolation: false, // If needed for Electron version < 5
      enableRemoteModule: true // If needed for Electron version < 5
    },
    title: "X-ray Weld Defect Detection App"
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', function () {
    mainWindow = null;
    if (backendProcess !== null) {
      backendProcess.kill(); // Also kill the backend process when the window is closed
    }
  });
  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault();
  });
}

const axios = require('axios'); // Make sure to install axios

function checkBackendHealth() {
  axios.get('http://127.0.0.1:5000')
    .then(response => {
      console.log('Backend is up:', response.status);
    })
    .catch(error => {
      console.error('Backend might be down:', error.message);
    });
}

