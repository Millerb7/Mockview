const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { spawn } = require('child_process');

// Set up the express app
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIO(server, {
  cors: {
    origin: "*",  // Allow your client origin
    methods: ["GET", "POST"],         // Allow only GET and POST methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true                  // Allow cookies and other credentials
  }
});

// Handle a client connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Start the Python script when a new client connects
  const pythonProcess = spawn('python', ['../server/python/video_processing.py']);  // Update the path to your Python script

  // Handle normal output
  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // Handle error output
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Handle on exit of the Python script
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Here you might also want to terminate the Python script if it's no longer needed
    pythonProcess.kill();
  });

});


// Export the server and Socket.IO instance
module.exports = { server, io };