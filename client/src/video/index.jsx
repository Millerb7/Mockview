import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://127.0.0.1:4000";

function Video() {
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('newFrame', data => {
      setFrame(data);  // Update the frame with the received data
    });

    return () => socket.disconnect();
  }, []);

  return <img src={frame} alt="Video Feed" />;
}

export default Video;
