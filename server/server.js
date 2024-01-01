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

console.log('Socket.IO server has been initialized');

// Handle a client connection
io.on('connection', (socket) => {
  console.log(`New client connected with id: ${socket.id}`);

  // Start the Python script when a new client connects
  const pythonProcess = spawn('python', ['../server/python/video_processing.py']);  // Update the path to your Python script
  console.log('Python process started');

  // Handle normal output
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
  });

  // Handle error output
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
  });

  // Handle on exit of the Python script
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
  });

  // Handle custom events, like 'newFrame'
  socket.on('newFrame', (data) => {
    console.log(`Received new frame from client with id: ${socket.id}`);
    io.emit('newFrame', data);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client with id: ${socket.id} disconnected. Reason: ${reason}`);
    //pythonProcess.kill(); // Terminate the Python script if it's no longer needed
    console.log('Python process killed');
  });

  socket.on('error', (error) => {
    console.error(`Error with client id: ${socket.id}. Error: ${error}`);
  });

});

// Export the server and Socket.IO instance
module.exports = { server, io };
