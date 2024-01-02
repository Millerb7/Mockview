import cv2
import socketio
import base64
import numpy as np

# Socket.IO client setup
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to the server")

@sio.event
def disconnect():
    print("Disconnected from the server")

# Load the pre-trained Haar Cascade classifier for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@sio.on('newFrame')
def new_frame(data):
    print("Received new frame.")

    # Decode the image from base64
    img_data = base64.b64decode(data.split(',')[1])
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convert to grayscale (Haar Cascade requires grayscale images)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Draw rectangles around the faces
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

    # If faces were detected, send the count back to the frontend
    if len(faces) > 0:
        sio.emit('faceCount', len(faces))

    # If you want to send the processed image back to the frontend, encode and emit it
    # _, buffer = cv2.imencode('.jpg', img)
    # encoded_img = base64.b64encode(buffer).decode('utf-8')
    # sio.emit('processedFrame', encoded_img)

# Connect to the Socket.IO server
sio.connect('http://127.0.0.1:4000')

try:
    sio.wait()
except KeyboardInterrupt:
    print("Script interrupted by user")
finally:
    sio.disconnect()
