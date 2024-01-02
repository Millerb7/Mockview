import React, { useEffect, useState, useRef } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://127.0.0.1:4000";

function Video() {
  const [stream, setStream] = useState(null);
  const [face, setFace] = useState(0)
  const videoRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO client
    socket.current = socketIOClient(ENDPOINT);
    console.log("Connected to server");

    socket.on('faceCount', (data) => {
      console.log(`Received new face value from client with id: ${socket.id}`, data);
      setFace(data);
    });

    // Request access to the user's camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    return () => {
      // Clean up: stop the stream and disconnect the socket
      stream?.getTracks().forEach(track => track.stop());
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!stream) return;

    const video = videoRef.current;
    video.play();

    // Periodically capture frames and send to the server
    const intervalId = setInterval(() => {
      const frame = captureFrame(video);
      socket.current.emit('newFrame', frame);
    }, 1000); // Adjust the interval as needed

    return () => {
      clearInterval(intervalId);
    };
  }, [stream]);

  // Function to capture a frame from the video element and convert to base64
  const captureFrame = (video) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  return (
    <div>
      <video ref={videoRef} style={{width: '100%'}} autoPlay muted />
      <p>{face ? "Face is present" : "Face is not present"}</p>
    </div>
  );
}

export default Video;
