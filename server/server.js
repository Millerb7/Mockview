const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Set up the express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIO(server);

// Handle a client connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // You can define custom events for communication as needed
  // For example, listen for a message from the client and respond
  socket.on('clientMessage', (message) => {
    console.log('Message from client:', message);
  });
});

// Start the server
const port = 4000; // Feel free to use any port
server.listen(port, () => console.log(`Server running on port ${port}`));

