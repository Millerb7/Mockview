// sendImageFrame.js
const fs = require('fs');
const { stdout } = require('process');
const socketIOClient = require("socket.io-client");
const ENDPOINT = "http://127.0.0.1:4000";  // Update with your server's address and port
const socket = socketIOClient(ENDPOINT);

// Emit the image data
    socket.on("connect", () => {
        console.log(`Connected to server ${ENDPOINT}'Send a frame every second'`)
        setInterval(() => {
            const image = fs.readFileSync('./mock.jpg');
            const imageBase64 = Buffer.from(image).toString('base64');
            socket.emit('newFrame', imageBase64);
        }, 1000);  // Adjust the interval as needed
    });

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("connect_error", (err) => {
    console.log(`Connect error: ${err.message}`);
});
