import base64
import cv2
import socketio
import os
import time

# Socket.IO client setup
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to the server")

@sio.event
def disconnect():
    print("Disconnected from the server")

# Connect to the Socket.IO server
sio.connect('http://127.0.0.1:4000')

# Initialize your video capture device
#cap = cv2.VideoCapture(0)  # Change '0' to your video source

script_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(script_dir, 'mock.jpg')
print(f"Using default image path: {image_path}")

def get_default_image():
    # Load the default image
    img = cv2.imread(image_path)
    if img is not None:
        return img
    else:
        print("Default image not found. Make sure the path is correct.")
        return None

try:
    while True:
        frame = get_default_image()
        if frame is None:
            break  # If no default image, exit the loop

        # Perform your video processing here
        processed_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Convert the frame to a format suitable for transmission
        _, buffer = cv2.imencode('.jpg', processed_frame)
        encoded_frame = base64.b64encode(buffer).decode('utf-8')

        # Send the processed frame or default image to the server
        sio.emit('newFrame', encoded_frame)

        # Control the frame rate
        time.sleep(10)  # Adjust as needed
except KeyboardInterrupt:
    print("Interrupted by user")

finally:
    # Release resources and disconnect
    print("Cleaning up and disconnecting...")
    #cap.release()
    sio.disconnect()
